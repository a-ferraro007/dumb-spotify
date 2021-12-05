import { useEffect, useState } from "react"
import TrackList from "../../components/TrackList"
import Layout from "../../components/Layout"
import { useAuth } from "../../context/auth"
import { usePlaylist } from "../../context/playlist"
import styles from "../.././styles/Playlist.module.css"
import Image from "next/image"
import ForkIcon from "../../components/SVG/ForkIcon"
import Loading from "../../components/SVG/Loading"
import { getCookie } from "../../lib/getCookie"
import { useRouter } from "next/router"

const playlists = () => {
  const {
    playlist,
    radioBtnState,
    masterId,
    handleSetMasterId,
    handleSetPlaylist,
    handleSetRadioBtn,
  } = usePlaylist()
  const [tracks, setTracks] = useState([])
  const { session, user, getNewAuthTokens } = useAuth()
  const [isCreatingFork, setIsCreatingFork] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = getCookie("refresh_token")
    if (token) {
      ;(async () => {
        try {
          await getNewAuthTokens(token)
        } catch (error) {
          console.log("error generating new auth token", error)
          router.replace("/")
        }
      })()
      //setRefreshToken(token)
    } else {
      router.replace("/")
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!session || !user) return
      console.log(playlist)
      setIsLoading(true)
      const tracks = await fetch(
        `/api/spotify/getTracksList?id=${playlist.playlistId}&access_token=${session.access_token}&total=${playlist.trackTotal}&reqCount=${playlist.reqCount}`
      )
      const tracksRes = await tracks.json()
      const trackItems = tracksRes.tracks.map((item) => {
        return item.track
      })
      setTracks([...trackItems])
      //setIsLoading(false)
    })()
  }, [session])

  const handleOnClick = async () => {
    if (playlist.isFork) {
      await handleUpdateForkedPlaylist()
    } else {
      await handleCreateFork()
    }
  }

  const handleCreateFork = async () => {
    setIsCreatingFork(true)
    try {
      const forkPlaylist = await fetch(`/api/spotify/forkPlaylist`, {
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
      fork[0].playlist.isFork = true
      handleSetMasterId(fork[0].master_playlist_id)
      handleSetPlaylist(fork[0].playlist)
      handleSetRadioBtn("forked")
      setIsCreatingFork(false)
      router.replace(`/playlists/${fork[0].playlist_id}`)
    } catch (error) {
      console.error(error)
      setIsCreatingFork(false)
    }
  }

  const handleUpdateForkedPlaylist = async () => {
    try {
      await fetch(
        `/api/spotify/updateForkedPlaylist?access_token=${session.access_token}&id=${playlist.playlistId}&master_id=${masterId}&spotify_id=${user.id}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  if (!playlist) return <> </>
  return (
    <>
      <Layout>
        {!isCreatingFork ? (
          <div className={styles.playlist__container}>
            <div className={styles.playlist__headerContainer}>
              <div className={styles.playlist__imageContainer}>
                <Image
                  src={playlist.image ? playlist.image : "/placeholder.png"}
                  width="250"
                  height="250"
                  layout="fixed"
                  className={styles.playlist__image}
                />
              </div>

              <div>
                <span
                  className={styles.playlist__subscript}
                  style={{ color: "var(--primary-text-green)" }}
                >
                  {playlist.isFork ? "FORK" : "LIKED"}
                </span>
                <h1 className={styles.playlist__heading}> {playlist.name} </h1>
                <p className={styles.playlist__description}>
                  {playlist.description}
                </p>
                <div className={styles.playlist__btnBar}>
                  <div className={styles.playlist__subscriptContainer}>
                    <span className={styles.playlist__subscript}>
                      {" "}
                      {playlist.owner?.display_name}
                    </span>
                    <span className={styles.playlist__subscript}>
                      {" "}
                      {playlist.trackTotal} songs
                    </span>
                  </div>

                  {playlist.isFork ? (
                    <button onClick={handleOnClick} className={styles.btn}>
                      <div className={styles.fork__btnIcon}>
                        <ForkIcon />
                      </div>
                      <span className={styles.fork__btnText}> update </span>
                    </button>
                  ) : (
                    <button onClick={handleOnClick} className={styles.btn}>
                      <div className={styles.fork__btnIcon}>
                        <ForkIcon />
                      </div>
                      <span className={styles.fork__btnText}> fork </span>
                    </button>
                  )}
                </div>{" "}
              </div>
            </div>

            <div className={styles.playlist__tracksContainer}>
              {!tracks.length && isLoading ? (
                <Loading width={50} height={50} />
              ) : (
                <TrackList tracks={tracks} />
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.creating__fork}>
              {" "}
              <Loading width={50} height={50} />
              <span className={styles.creating__forkHeading}>
                forking:{" "}
                <span style={{ color: "rgba(255,255,255,.7)" }}>
                  {" "}
                  {playlist.name}{" "}
                </span>
              </span>{" "}
              <span style={{ color: "rgba(255,255,255,.7)", fontSize: "14px" }}>
                {" "}
                this may take a minute
              </span>
            </div>
          </>
        )}
      </Layout>
    </>
  )
}

export default playlists
