import { useEffect, useState } from "react"
import TrackList from "../components/TrackList"
import Layout from "../components/Layout"
import { useAuth } from "../context/auth"
import { usePlaylist } from "../context/playlist"
import styles from ".././styles/Playlist.module.css"

const playlist = () => {
  const { playlist, isFork, masterId } = usePlaylist()
  const [tracks, setTracks] = useState([])
  const { session, user } = useAuth()

  useEffect(() => {
    ;(async () => {
      const tracks = await fetch(
        `api/spotify/getTracksList?id=${playlist.playlistId}&access_token=${session.access_token}&total=${playlist.trackTotal}&reqCount=${playlist.reqCount}`
      )
      const tracksRes = await tracks.json()
      const trackItems = tracksRes.tracks.map((item) => {
        return item.track
      })
      setTracks([...trackItems])
    })()
  }, [])

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

  return (
    <>
      <Layout>
        {playlist ? (
          <div className={styles.playlist__container}>
            <h1 className={styles.playlist__heading}> {playlist.name} </h1>
            <p className={styles.playlist__description}>
              {playlist.description}
            </p>
            <span className={styles.playlist__subscript}>
              {" "}
              {playlist.owner?.display_name}
            </span>
            <span className={styles.playlist__subscript}>
              {" "}
              {playlist.trackTotal} songs
            </span>
            <div className={styles.playlist__tracksContainer}>
              {tracks.length ? <TrackList tracks={tracks} /> : <> </>}
            </div>
          </div>
        ) : (
          <></>
        )}
      </Layout>
    </>
  )
}

export default playlist
