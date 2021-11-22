import { supabase } from "./client"

export const updateForkedPlaylist = async (playlist_id, spotify_id, uris) => {
  return await supabase
    .from("forked_playlists")
    .update({
      uris: { tracks: uris },
    })
    .match({ spotify_id, playlist_id })
}

export const addForkToDB = async (
  playlist_id,
  master_playlist_id,
  spotify_id,
  uris,
  playlist
) => {
  return await supabase.from("forked_playlists").insert([
    {
      playlist_id,
      master_playlist_id,
      spotify_id,
      uris,
      playlist,
    },
  ])
}
