import { createPlaylist, getTracks } from "../../../lib/spotify/utils"
import { addForkToDB } from "../../../lib/supabase/utils"

export default async (req, res) => {
  const { access_token, name, reqCount, owner, master_playlist_id, total } =
    JSON.parse(req.body)

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
      owner
    )

    const { data, error } = await addForkToDB(
      createPlaylistRes.id,
      master_playlist_id,
      "aferraro1",
      { tracks: trackUris },
      {
        name: createPlaylistRes.name,
        playlistId: createPlaylistRes.id,
        trackCount: createPlaylistRes.tracks,
        trackTotal: createPlaylistRes.tracks.total,
        reqCount: Math.round(createPlaylistRes.tracks.total / 100 + 0.5),
        owner: createPlaylistRes.owner,
      }
    )
    if (error) throw error

    res.status(200).json(true)
  } catch (error) {
    console.error("error forking playlist", error)
    res.status(400).json(error)
  }
}
