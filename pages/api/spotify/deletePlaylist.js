import { deletePlaylist } from "../../../lib/spotify/utils"
import { supabase } from "../../../lib/supabase/client"

export default async (req, res) => {
  const { access_token, playlist_id, isFork, spotify_id } = req.query
  let sup = { data: null, error: null }
  console.log(isFork)
  try {
    const deletePlaylistRes = await deletePlaylist(access_token, playlist_id)
    //if (isFork) {
    //  sup = await supabase
    //    .from("forked_playlists")
    //    .delete()
    //    .match({ spotify_id, playlist_id })
    //}
    console.log("delete spot", deletePlaylistRes)
    console.log("delete sup", sup)
    if (sup.error) throw sup.error
    res.status(200).json(deletePlaylistRes)
  } catch (error) {
    console.error("error deleting  playlist", error)
    res.status(400).json(error)
  }
}
