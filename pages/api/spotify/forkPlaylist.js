import { createPlaylist, getTracks } from "../../../lib/spotify/utils"
import { addForkToDB } from "../../../lib/supabase/utils"

export default async (req, res) => {
  const {
    access_token,
    name,
    reqCount,
    owner,
    master_playlist_id,
    total,
    user,
    image,
  } = JSON.parse(req.body)

  try {
    const getTracksRes = await getTracks(
      access_token,
      master_playlist_id,
      reqCount,
      total
    )
    const trackUris = getTracksRes.map((item) => {
      return item.track.uri
    })

    const createPlaylistRes = await createPlaylist(
      access_token,
      name,
      trackUris,
      reqCount,
      owner,
      image
    )

    console.log("create", createPlaylistRes)
    const { data, error } = await addForkToDB(
      createPlaylistRes.id,
      master_playlist_id,
      user,
      { tracks: trackUris },
      {
        name: createPlaylistRes.name,
        playlistId: createPlaylistRes.id,
        trackCount: createPlaylistRes.tracks,
        trackTotal: createPlaylistRes.tracks.total,
        reqCount: Math.round(createPlaylistRes.tracks.total / 100 + 0.5),
        owner: createPlaylistRes.owner,
        image,
      }
    )
    if (error) throw error

    res.status(200).json(true)
  } catch (error) {
    console.error("error forking playlist", error)
    res.status(400).json(error)
  }
}
