import { supabase } from "./client"

export const updateForkedPlaylist = async (playlist_id, spotify_id, uris) => {
  return await supabase
    .from("forked_playlists")
    .update({
      uris: { tracks: uris },
    })
    .match({ spotify_id, playlist_id })
}
