export default async (req, res) => {
  try {
    const urlParams = {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      responseType: "code",
      redirectUri: process.env.redirect_uri,
      scope:
        "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-read-currently-playing user-top-read playlist-modify-public playlist-modify-private",
      show_dialog: true,
    }

    const spotifyURL = new URL("https://accounts.spotify.com/authorize")
    const params = new URLSearchParams(spotifyURL.search)
    params.append("client_id", urlParams.clientId)
    params.append("response_type", "code")
    params.append("redirect_uri", urlParams.redirectUri)
    params.append("scope", urlParams.scope)

    res.status(200).json({ url: spotifyURL + "?" + params.toString() })
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}
