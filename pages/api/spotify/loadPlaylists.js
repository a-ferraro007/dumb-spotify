import { loadPlaylists } from "../../../lib/spotify/utils"

export default async (req, res) => {
  const { access_token, user } = JSON.parse(req.body)
  try {
    const playlists = await loadPlaylists(access_token, user)

    res.status(200).json(playlists)
  } catch (error) {
    console.error("error loading playlists", error)
    res.status(400).json(error)
  }
}
