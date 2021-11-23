import { supabase } from "../../../lib/supabase/client"

export default async (req, res) => {
  const { playlist_id, master_playlist_id, spotify_id, uris, playlist } =
    JSON.parse(req.body)

  try {
    const { data, error } = await supabase.from("forked_playlists").insert([
      {
        playlist_id,
        master_playlist_id,
        spotify_id,
        uris,
        playlist,
      },
    ])
    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}
