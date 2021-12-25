import { getTracks, getPlaylist, updateFork } from "../../../lib/spotify/utils"
import { supabase } from "../../../lib/supabase/client"
import { updateForkedPlaylist } from "../../../lib/supabase/utils"

const handleUpdateFork = async (
  master,
  fork,
  deletedUris,
  access_token,
  playlist_id,
  spotify_id
) => {
  console.log(deletedUris)
  for (const key in master) {
    if (
      !Object.hasOwnProperty.call(fork, key) &&
      !Object.hasOwnProperty.call(deletedUris, key)
    ) {
      console.log("adding", key)
      fork[key] = true
    }
  }
  const uris = Object.keys(fork)

  try {
    const res = await updateFork(
      access_token,
      playlist_id,
      Math.round(uris.length / 100 + 0.5),
      uris
    )
    const { error } = updateForkedPlaylist(playlist_id, spotify_id, uris)
    if (error) throw error
    return uris
  } catch (error) {
    console.error("error handling update", error)
    throw error
  }
}

const handleGetDeletedUris = async (spotify_id, playlist_id, spotifyFork) => {
  const deletedUris = {}
  console.log(spotifyFork)
  const { data, error } = await supabase
    .from("forked_playlists")
    .select("uris")
    .match({ spotify_id, playlist_id })
    .single()

  data.uris.tracks.forEach((uri) => {
    console.log("uri", uri)
    if (!spotifyFork[uri]) deletedUris[uri] = true
  })

  return {
    deletedUris,
    error,
  }
}

export default async (req, res) => {
  const { access_token, master_id, id, spotify_id } = req.query
  const masterUriObj = {}
  const forkUriObj = {}

  try {
    const forkedPlaylist = await getPlaylist(access_token, id)
    const forkedReqCount = Math.round(forkedPlaylist.tracks.total / 100 + 0.5)
    const forkedTrackTotal = forkedPlaylist.tracks.total

    const getForkedTracksRes = await getTracks(
      access_token,
      id,
      forkedReqCount,
      forkedTrackTotal
    )
    const forkedUris = getForkedTracksRes.map((item) => {
      forkUriObj[item.track.uri] = true
      return item.track.uri
    })

    const { deletedUris } = await handleGetDeletedUris(
      spotify_id,
      id,
      forkUriObj
    )

    const { error } = updateForkedPlaylist(id, spotify_id, forkedUris)
    if (error) throw error

    const masterPlaylist = await getPlaylist(access_token, master_id)
    const masterReqCount = Math.round(masterPlaylist.tracks.total / 100 + 0.5)
    const masterTrackTotal = masterPlaylist.tracks.total

    const getMasterPlaylistsTracksRes = await getTracks(
      access_token,
      master_id,
      masterReqCount,
      masterTrackTotal
    )
    getMasterPlaylistsTracksRes.map((item) => {
      masterUriObj[item.track.uri] = true
      return item.track.uri
    })

    const updatedUris = await handleUpdateFork(
      masterUriObj,
      forkUriObj,
      deletedUris,
      access_token,
      id,
      spotify_id
    )

    console.log("log update fork", updatedUris)
    res.status(200).json({ updatedUris, deletedUris })
  } catch (error) {
    console.error("error updating fork", error)
    res.status(400).json(error)
  }
}
