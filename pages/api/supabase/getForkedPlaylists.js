import { supabase } from "../../../lib/supabase/client"

export default async (req, res) => {
  const { id, playlist_id } = req.query
  let resp = {}
  try {
    if (!playlist_id) {
      resp = await supabase
        .from("forked_playlists")
        .select("playlist_id, master_playlist_id, playlist")
        .eq("spotify_id", id)
      if (resp.error) throw resp.error
    } else {
      resp = await supabase
        .from("forked_playlists")
        .select("playlist_id, master_playlist_id, playlist")
        .match({ spotify_id: id, playlist_id: playlist_id })

      if (resp.error) throw resp.error
    }

    res.status(200).json(resp.data)
  } catch (error) {
    console.error(error.message)
    res.status(400).json({ error: error.message })
  }
}
