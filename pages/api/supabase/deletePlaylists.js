import { supabase } from "../../../lib/supabase/client"

export default async (req, res) => {
  const { playlistIds, spotify_id } = JSON.parse(req.body)

  try {
    const { data, error } = await supabase
      .from("forked_playlists")
      .delete()
      .in("playlist_id", [...playlistIds])
      .eq("spotify_id", spotify_id)

    if (error) throw error
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}
