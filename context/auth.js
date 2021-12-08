import { useRouter } from "next/router"
import { createContext, useContext, useEffect, useState } from "react"
import { getCookie } from "../lib/getCookie"

export const AuthContext = createContext({
  session: null,
  user: null,
  loading: false,
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  const authorizationCode = async (router) => {
    const req = await fetch("/api/auth/authorize")
    const authResponse = await req.json()
    await router.replace(authResponse.url)
    return authResponse
  }

  const getAuthTokens = async (router, code) => {
    try {
      const req = await fetch(`/api/auth/token/access/${code}`)
      const { access_token, refresh_token, expires_in } = await req.json()

      if (access_token && refresh_token) {
        document.cookie = `access_token=${access_token};path=/;expires=${expires_in};`
        document.cookie = `refresh_token=${refresh_token}`
        const user = await getUser(access_token)
        setUser(user)
        document.cookie = `user=${JSON.stringify(user)}`
        await fetch("api/supabase/validateUser", {
          method: "POST",
          body: JSON.stringify({ id: user.id }),
        })
        setSession({ access_token, refresh_token, expires_in })
        await router.replace("/collection/playlists")
      } else {
        throw new Error(
          `Error returning Access Token: ${JSON.stringify({
            access_token,
            refresh_token,
            expires_in,
          })}`
        )
      }
    } catch (error) {
      console.error("err", error)
    }
  }

  const getNewAuthTokens = async (token) => {
    console.log("toke s")
    const refreshToken = getCookie("refresh_token")
    const req = await fetch(`/api/auth/token/refresh/${refreshToken}`)
    const { access_token, expires_in } = await req.json()

    if (access_token) {
      document.cookie = `access_token=${access_token};path=/;max-age=${expires_in};`
      const user = await getUser(access_token)
      setUser(user)
      setSession({ access_token, refresh_token: refreshToken, expires_in })
      return {
        access_token,
        expires_in,
      }
    } else {
      throw new Error(
        `Error returning Access Token: ${JSON.stringify({
          access_token,
          expires_in,
        })}`
      )
    }
  }

  const getUser = async (token) => {
    try {
      const userReq = await fetch(`/api/spotify/getUser?access_token=${token}`)
      const { user } = await userReq.json()
      return user
    } catch (error) {
      throw error
    }
  }

  const handleLogOut = () => {
    console.log("log")
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    setUser(null)
    setSession(null)
    router.replace("/login")
  }

  //useEffect(() => {
  //  console.log("cookies", user)
  //}, [user])

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        user,
        authorizationCode,
        getAuthTokens,
        getNewAuthTokens,
        handleLogOut,
      }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
