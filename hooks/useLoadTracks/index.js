import { useQuery } from "react-query"

const loadTracks = async (playlist, access_token) => {
  try {
    const tracks = await fetch(
      `/api/spotify/getTracksList?id=${playlist.playlistId}&access_token=${access_token}&total=${playlist.trackTotal}&reqCount=${playlist.reqCount}`
    )
    const tracksRes = await tracks.json()
    return tracksRes.tracks?.map((item) => {
      return item.track
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

const useLoadTracks = (playlist, access_token) => {
  return useQuery(["load-tracks", { playlist, access_token }], () =>
    loadTracks(playlist, access_token)
  )
}

export { loadTracks, useLoadTracks }
