import { useQuery } from "react-query"

const loadPlaylist = async (playlist, playlistId, access_token, user) => {
  if (playlist.playlistId)
    return new Promise((resolve) => {
      resolve(playlist)
    })

  try {
    const getForkedPlaylistsRes = await fetch(
      `/api/supabase/getForkedPlaylists?id=${user.id}&playlist_id=${playlistId}`
    )
    const forkedPlaylist = await getForkedPlaylistsRes.json()
    if (getForkedPlaylistsRes.status === 400) {
      throw new Error(forkedPlaylist.error)
    }
    if (forkedPlaylist.length > 0) {
      return {
        ...forkedPlaylist[0]?.playlist,
        isFork: true,
        masterId: forkedPlaylist[0]["master_playlist_id"],
      }
    } else {
      const getPlaylistRes = await fetch(
        `/api/spotify/getPlaylist?playlist_id=${playlistId}&access_token=${access_token}`
      )

      const playlistObj = await getPlaylistRes.json()
      return {
        name: playlistObj.name,
        playlistId: playlistObj.id,
        trackCount: playlistObj.tracks,
        trackTotal: playlistObj.tracks.total,
        reqCount: Math.round(playlistObj.tracks.total / 100 + 0.5),
        owner: playlistObj.owner,
        image: playlistObj?.images[0]?.url,
        description: playlistObj.description,
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const useLoadPlaylist = (playlist, playlistId, access_token, user) => {
  return useQuery(
    ["load-single-playlist", { playlist, playlistId, access_token, user }],
    () => loadPlaylist(playlist, playlistId, access_token, user),
    { staleTime: 100000 }
  )
}

export { loadPlaylist, useLoadPlaylist }
