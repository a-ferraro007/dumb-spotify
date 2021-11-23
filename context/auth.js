import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRouter,
} from "react"
//import { supabase } from "../lib/supabase"

export const AuthContext = createContext({
  session: null,
  loading: false,
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const authorizationCode = async (router) => {
    const req = await fetch("/api/auth/authorize")
    const authResponse = await req.json()
    await router.replace(authResponse.url)
    return authResponse
  }

  const getAuthTokens = async (router, code) => {
    try {
      const req = await fetch(`/api/auth/token/access/${code}`)
      const { data } = await req.json()
      console.log(data)
      if (data.access_token && data.refresh_token) {
        document.cookie = `access_token=${data.access_token}; expires=${data.expires_in}`
        document.cookie = `refresh_token=${data.refresh_token}`
        const user = await getUser(data.access_token)
        setUser(user)
        document.cookie = `user=${JSON.stringify(user)}`
        await fetch("api/supabase/validateUser", {
          method: "POST",
          body: JSON.stringify({ id: user.id }),
        })

        await router.replace("/fork")
      } else {
        throw new Error(`Error returning Access Token: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      console.error("err", error)
    }
  }

  const getNewAuthTokens = async (token) => {
    const refreshToken = document.cookie
      .split(";")
      .find((row) => row.includes("refresh_token="))
      .split("=")[1]

    const req = await fetch(`/api/auth/token/refresh/${refreshToken}`)
    const { data } = await req.json()
    console.log("test", data)
    if (data.access_token) {
      document.cookie = `access_token=${data.access_token}; max-age=${data.expires_in}`
      const user = await getUser(data.access_token)
      setUser(user)
      return data //returning whole data obj right now
    } else {
      throw new Error(`Error returning Access Token: ${JSON.stringify(data)}`)
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

  useEffect(() => {
    console.log("test auth", user)
    //setLoading(true)
    //setSession(supabase.auth.session())
    //supabase.auth.onAuthStateChange((_event, session) => {
    //  setLoading(true)
    //  setSession(session)
    //  setLoading(false)
    //})
    //setLoading(false)
  }, [user])
  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        user,
        authorizationCode,
        getAuthTokens,
        getNewAuthTokens,
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
