export default async (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const { refreshToken } = req.query

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const baseURI = "https://accounts.spotify.com/api/token"
  const params = new URLSearchParams(baseURI.search)
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refreshToken)

  try {
    const resp = await fetch(baseURI, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
    const data = await resp.json()
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}
