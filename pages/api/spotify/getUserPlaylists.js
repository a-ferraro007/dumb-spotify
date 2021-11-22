export default async (req, res) => {
  const { access_token } = req.query
  const baseURI = "https://api.spotify.com/v1/me/playlists"

  try {
    const resp = await fetch(baseURI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    const data = await resp.json()

    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}
