export const authorizationCode = async (router) => {
  const req = await fetch('/api/authorize')
  const authResponse = await req.json()
  await router.replace(authResponse.url)
  return authResponse
}

export const getAuthTokens = async (router, code) => {
  //Move out of access folder
  const req = await fetch(`/api/token/access/${code}`)
  const { data } = await req.json()

  if (data.access_token && data.refresh_token) {
    document.cookie = `access_token=${data.access_token}`
    document.cookie = `refresh_token=${data.refresh_token}`
    await router.replace('/home')
  } else {
    throw new Error(`Error returning Access Token: ${JSON.stringify(data)}`)
  }
}

export const getNewAuthTokens = async () => {
  const refreshToken = document.cookie
    .split(';')
    .find((row) => row.includes('refresh_token='))
    .split('=')[1]

  //Move out of refresh folder
  const req = await fetch(`/api/token/refresh/${refreshToken}`)
  const { data } = await req.json()
  console.log('test', data)
  if (data.access_token) {
    document.cookie = `access_token=${data.access_token}`
    return data //returning whole data obj right now
  } else {
    throw new Error(`Error returning Access Token: ${JSON.stringify(data)}`)
  }
}
