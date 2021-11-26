import { usePlaylist } from "../context/playlist"

const playlist = () => {
  const { playlist } = usePlaylist()

  const handleCreateFork = async () => {
    try {
      const forkPlaylist = await fetch(`api/spotify/forkPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          access_token: session.access_token,
          user: user.id,
          name: playlist.name,
          reqCount: playlist.reqCount,
          owner: playlist.owner.display_name,
          master_playlist_id: playlist.playlistId,
          total: playlist.trackTotal,
          image: playlist.image,
        }),
      })
      const fork = await forkPlaylist.json()
      console.log(fork)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateForkedPlaylist = async () => {
    try {
      await fetch(
        `api/spotify/updateForkedPlaylist?access_token=${session.access_token}&id=${playlist.playlistId}&master_id=${master}&spotify_id=${user.id}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  console.log(playlist)
  return <div></div>
}

export default playlist
