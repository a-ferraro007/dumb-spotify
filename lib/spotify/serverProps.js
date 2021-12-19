import { getNewAccessToken, getUserPlaylists } from "./utils"
import { supabase } from "../supabase/client"

export const playlistsProps = async (access_token, refresh_token, user) => {
  const deletedPlaylists = []
  const forked = []
  const usrPlaylistObj = {}
  const forkPlaylistObj = {}
  let liked = []

  console.log("PLAYLIST PROPS:", access_token)
  try {
    const getForkedPlaylistsRes = await supabase
      .from("forked_playlists")
      .select("playlist_id, master_playlist_id, playlist")
      .eq("spotify_id", user.id)
    if (getForkedPlaylistsRes.error)
      throw new Error(getForkedPlaylistsRes.error)
    console.log(getForkedPlaylistsRes.data)
    //const getForkedPlaylistsReq = await fetch(
    //  `${process.env.BASE_URL}/api/supabase/getForkedPlaylists?id=${user.id}`
    //)
    //const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
    getForkedPlaylistsRes.data.forEach((fork) => {
      forkPlaylistObj[fork.playlist_id] = fork.playlist_id
    })

    //const req = await fetch(
    //  `${process.env.BASE_URL}/api/spotify/getUserPlaylists?access_token=${access_token}`
    //)
    const res = await getUserPlaylists(access_token)

    //const res = await req.json()

    if (res.error?.status === 401) {
      throw new Error(res.error.message)
    }

    liked = res.items?.reduce((result, playlist) => {
      usrPlaylistObj[playlist.id] = playlist.id
      if (!forkPlaylistObj[playlist.id]) {
        result.push({
          name: playlist.name,
          playlistId: playlist.id,
          trackCount: playlist.tracks,
          trackTotal: playlist.tracks.total,
          reqCount: Math.round(playlist.tracks.total / 100 + 0.5),
          owner: playlist.owner,
          image: playlist?.images[0]?.url,
          description: playlist.description,
        })
      }
      return result
    }, [])

    getForkedPlaylistsRes.data.forEach((e) => {
      if (usrPlaylistObj[e.playlist_id]) {
        forked.push({
          id: e.playlist_id,
          master_id: e.master_playlist_id,
          playlist: e.playlist,
        })
      } else {
        deletedPlaylists.push(e.playlist_id)
      }
    })

    //await fetch(`${process.env.BASE_URL}/api/supabase/deletePlaylists`, {
    //  method: "POST",
    //  body: JSON.stringify({
    //    spotify_id: user.id,
    //    playlistIds: deletedPlaylists,
    //  }),
    //})

    const del = await supabase
      .from("forked_playlists")
      .delete()
      .in("playlist_id", [...deletedPlaylists])
      .eq("spotify_id", user.id)
    if (del?.error) throw new Error(del?.error)
  } catch (error) {
    console.error("error", error)
    throw error
  }

  return {
    forked,
    liked,
  }
}
