export const authorizationCode = async (router) => {
  const req = await fetch("/api/authorize")
  const authResponse = await req.json()
  await router.replace(authResponse.url)
  return authResponse
}

export const getAuthTokens = async (router, code) => {
  try {
    const req = await fetch(`/api/token/access/${code}`)
    const { data } = await req.json()
    console.log(data)
    if (data.access_token && data.refresh_token) {
      document.cookie = `access_token=${data.access_token}; expires=${data.expires_in}`
      document.cookie = `refresh_token=${data.refresh_token}`
      const user = await getUser(data.access_token)
      document.cookie = `user=${JSON.stringify(user)}`
      await fetch("api/supabase/validateUser", {
        method: "POST",
        body: JSON.stringify({ id: user.id }),
      })

      await router.replace("/home")
    } else {
      throw new Error(`Error returning Access Token: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    console.error("err", error)
  }
}

export const getNewAuthTokens = async (token) => {
  const refreshToken = document.cookie
    .split(";")
    .find((row) => row.includes("refresh_token="))
    .split("=")[1]

  const req = await fetch(`/api/token/refresh/${refreshToken}`)
  const { data } = await req.json()
  console.log("test", data)
  if (data.access_token) {
    document.cookie = `access_token=${data.access_token}; max-age=${data.expires_in}`
    return data //returning whole data obj right now
  } else {
    throw new Error(`Error returning Access Token: ${JSON.stringify(data)}`)
  }
}

const getUser = async (token) => {
  try {
    const userReq = await fetch(`/api/getUser?access_token=${token}`)
    const { user } = await userReq.json()
    return user
  } catch (error) {
    throw error
  }
}
