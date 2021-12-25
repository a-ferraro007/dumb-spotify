import { useEffect, useState } from "react"
import TrackList from "../../components/TrackList"
import Layout from "../../components/Layout"
import { useAuth } from "../../context/auth"
import { usePlaylist } from "../../context/playlist"
import styles from "../.././styles/Playlist.module.css"
import Image from "next/image"
import ForkIcon from "../../components/SVG/ForkIcon"
import Loading from "../../components/SVG/Loading"
import { useRouter } from "next/router"
import Music from "../../components/SVG/Music"
import { useLoadPlaylist, useLoadTracks } from "../../hooks"
import { useUpdateForkedPlaylist } from "../../hooks/useUpdatePlaylist"

export async function getServerSideProps(context) {
  const { refresh_token, user } = context.req.cookies
  let access_token = context.req.cookies.access_token
  const headers = context.res.getHeaders()

  console.log("SERVERSIDE HEADERS:", headers)
  //need to check the set cookie header if the new access token
  //comes from refreshing the current page
  if (headers["set-cookie"]) {
    access_token = headers["set-cookie"][0]
      .split(";")
      .find((row) => row.includes("access_token="))
      ?.split("=")[1]

    console.log("SERVERSIDE SET COOKIE:", headers["set-cookie"])
  }

  if (!user || !refresh_token)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  return {
    props: {
      usr: JSON.parse(user),
      propSession: {
        access_token,
        refresh_token,
      },
    },
  }
}

const playlists = ({ usr, propSession }) => {
  const {
    playlist: ctxPlaylist,
    masterId,
    mood,
    handleSetMasterId,
    handleSetPlaylist,
    handleSetRadioBtn,
    handleSetMood,
  } = usePlaylist() //normalize playlist data vs refresh
  const { session, user, setUser, setSession } = useAuth()
  const [isCreatingFork, setIsCreatingFork] = useState(false)
  const router = useRouter()
  const { playlistId } = router.query
  const { data: playlist, isLoading: loadingPlaylist } = useLoadPlaylist(
    ctxPlaylist,
    playlistId,
    propSession.access_token,
    usr
  )
  const { data: tracks, isLoading } = useLoadTracks(
    playlist,
    propSession.access_token
  )
  const updateForkedPlaylistMutation = useUpdateForkedPlaylist()

  useEffect(() => {
    if (playlist?.playlistId) handleSetPlaylist(playlist)
  }, [playlist])

  useEffect(() => {
    handleSetMood("rgb(80, 56, 160)")
    setUser(usr)
    setSession(propSession)
  }, [])

  useEffect(() => {
    console.log(updateForkedPlaylistMutation)
  }, [updateForkedPlaylistMutation])

  const handleOnClick = async () => {
    if (playlist.isFork) {
      updateForkedPlaylistMutation.mutate({
        accessToken: propSession.access_token,
        playlist: playlist,
        masterId: masterId ? masterId : playlist.masterId, //this shouldnt be necessary. normalize this data
        userId: user.id,
      })
      //await handleUpdateForkedPlaylist()
    } else {
      await handleCreateFork()
    }
  }

  const handleShowTracks = () => {
    console.log("show", tracks?.length)
    if (!tracks?.length && isLoading) return <Loading width={50} height={50} />
    else if (!tracks?.length && !isLoading) {
      return (
        <span style={{ color: "#fff", zIndex: "10" }}>no tracks found</span>
      )
    } else if (tracks?.length) {
      return <TrackList tracks={tracks} />
    }
  }

  const handleCreateFork = async () => {
    setIsCreatingFork(true)
    try {
      const forkPlaylist = await fetch(`/api/spotify/forkPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          access_token: propSession.access_token,
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

  //REACT QUERY MUTATION?
  const handleUpdateForkedPlaylist = async () => {
    try {
      await fetch(
        `/api/spotify/updateForkedPlaylist?access_token=${session.access_token}&id=${playlist.playlistId}&master_id=${masterId}&spotify_id=${user.id}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  //There's no such thing as deleting a playlist in spotify
  //need to figure out how they do it.

  //const handleDeletePlaylist = async () => {
  //  console.log(playlist)
  //  try {
  //    const data = await fetch(
  //      `/api/spotify/deletePlaylist?access_token=${session.access_token}&playlist_id=${playlist.playlistId}&master_id=${masterId}&spotify_id=${user.id}&isFork=${playlist.isFork}`
  //    )
  //    console.log(data)
  //    router.replace("/")
  //  } catch (error) {
  //    console.error
  //  }
  //}

  return (
    <>
      <Layout>
        {!playlist ? (
          <></>
        ) : (
          <>
            {!isCreatingFork ? (
              <div className={styles.playlist__container}>
                <div className={styles.playlist__headerContainer}>
                  <div
                    className={styles.playlist__headerBgColor}
                    style={{ backgroundColor: mood }}
                  >
                    {" "}
                  </div>
                  <div className={styles.playlist__headerBg}></div>
                  <div className={styles.playlist__imageContainer}>
                    {!playlist.image ? (
                      <Music width={250} height={250} />
                    ) : (
                      <Image
                        src={
                          playlist.image ? playlist.image : "/placeholder.png"
                        }
                        width="250"
                        height="250"
                        layout="fixed"
                        className={styles.playlist__image}
                      />
                    )}
                  </div>

                  <div style={{ zIndex: "10", alignSelf: "end" }}>
                    <span
                      className={styles.playlist__subscript}
                      style={{ color: "var(--primary-text-green)" }}
                    >
                      {playlist.isFork ? "FORK" : "LIKED"}
                    </span>
                    <h1 className={styles.playlist__heading}>
                      {" "}
                      {playlist.name}{" "}
                    </h1>
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
                      {/*<button
                    style={{ color: "#fff" }}
                    onClick={handleDeletePlaylist}
                  >
                    delete
                  </button>*/}
                    </div>{" "}
                  </div>
                </div>

                <div
                  className={styles.playlist__tracksContainer}
                  style={{ position: "relative" }}
                >
                  <div
                    className={styles.playlist__headerBgColorBot}
                    style={{ backgroundColor: mood }}
                  >
                    {" "}
                  </div>
                  <div className={styles.playlist__headerBgBot}></div>

                  {handleShowTracks()}
                </div>
              </div>
            ) : (
              <>
                <div className={styles.creating__fork}>
                  {" "}
                  <Loading width={50} height={50} />
                  <span className={styles.creating__forkHeading}>
                    forking:{" "}
                    <span style={{ color: "rgba(255,255,255,1)" }}>
                      {" "}
                      {playlist.name}{" "}
                    </span>
                  </span>{" "}
                  <span
                    style={{ color: "rgba(255,255,255,.7)", fontSize: "14px" }}
                  >
                    {" "}
                    this may take a minute
                  </span>
                </div>
              </>
            )}
          </>
        )}
      </Layout>
    </>
  )
}

export default playlists
