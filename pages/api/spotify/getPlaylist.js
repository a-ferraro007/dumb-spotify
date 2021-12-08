export default async (req, res) => {
  const { access_token, playlist_id } = req.query

  const baseURI = `https://api.spotify.com/v1/playlists/${playlist_id}`

  try {
    const resp = await fetch(baseURI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
    const playlist = await resp.json()

    res.status(200).json(playlist)
  } catch (error) {
    console.error("error getting user", error)
    res.status(400).json(error)
  }
}
