import { useQuery } from "react-query"

const loadTracks = async (playlist, accessToken) => {
  //not sure about early returning here. Pretty sure reactQueries
  //need to either return a resolved promise or throw. I guess playlist
  //might also be undefined the first time react-query runs this query if
  //its on a refresh and router.query hasnt returned yet?
  if (!playlist) return
  try {
    const tracks = await fetch(
      `/api/spotify/getTracksList?id=${playlist.playlistId}&access_token=${accessToken}&total=${playlist.trackTotal}&reqCount=${playlist.reqCount}`
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

const useLoadTracks = (playlist, accessToken) => {
  return useQuery(["load-tracks", { playlist, accessToken }], () =>
    loadTracks(playlist, accessToken)
  )
}

export { loadTracks, useLoadTracks }
