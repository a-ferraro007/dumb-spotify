export const playlistsProps = async (access_token, refresh_token, user) => {
  let token =
    "BQCL0fgxiyL5d8Deg2etyUjGDLMcdOiNGBaJaULmmaNJ8Vo1kR5lC6rPzgQfyYBVMOZQDDj3EQUbn-ZvjbcCjFPMuavp4Inqp6GTl7ClA2GCifaTLTHf4JXIJriH8SLwfKdJHEG0dbJpuMkTDjf7oxunni3tGvovokxPrkk-OEFI7zJT7ne4mGu0UVs_Gnac_e7syv-ytIEaYWSILUnLXJk8Y6aPWc_Esi03Rb-KmeAww9V"

  const deletedPlaylists = []
  const forked = []
  let liked = []
  const usrPlaylistObj = {}
  const forkPlaylistObj = {}
  try {
    const getForkedPlaylistsReq = await fetch(
      `${process.env.BASE_URL}/api/supabase/getForkedPlaylists?id=${user.id}`
    )
    const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
    getForkedPlaylistsRes.forEach((fork) => {
      forkPlaylistObj[fork.playlist_id] = fork.playlist_id
    })
    const req = await fetch(
      `${process.env.BASE_URL}/api/spotify/getUserPlaylists?access_token=${access_token}`
    )

    const res = await req.json()
    liked = res.data.items.reduce((result, playlist) => {
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

    getForkedPlaylistsRes.forEach((e) => {
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

    await fetch(`${process.env.BASE_URL}/api/supabase/deletePlaylists`, {
      method: "POST",
      body: JSON.stringify({
        spotify_id: user.id,
        playlistIds: deletedPlaylists,
      }),
    })
  } catch (error) {
    console.error("error", error)
    throw error
  }

  return {
    forked,
    liked,
  }
}
