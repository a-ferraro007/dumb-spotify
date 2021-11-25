import { useEffect, useState } from "react"
import { getCookie } from "../lib/getCookie"
import { useAuth } from "../context/auth"
import styles from "../styles/Fork.module.css"
import router from "next/router"
import PlaylistCard from "../components/PlaylistCard"
import Layout from "../components/Layout"

const Fork = () => {
  const [refreshToken, setRefreshToken] = useState({})
  const [session, setSession] = useState({ access_token: null })
  const [userPlaylists, setUserPlaylists] = useState([])
  const [forkedPlaylists, setForkedPlaylists] = useState([])
  const { user, getNewAuthTokens } = useAuth()

  useEffect(() => {
    const token = getCookie("refresh_token")
    if (token) {
      ;(async () => {
        try {
          const newSession = await getNewAuthTokens(refreshToken)
          setSession(newSession)
        } catch (error) {
          console.log("error generating new auth token", error)
          router.replace("/")
        }
      })()
      setRefreshToken(token)
    } else {
      router.replace("/")
    }
  }, [])

  useEffect(() => {
    if (!session.access_token || !user) return
    ;(async () => {
      const usrTrackObj = {}
      const deletedPlaylists = []
      try {
        const req = await fetch(
          `api/spotify/getUserPlaylists?access_token=${session.access_token}`
        )
        const res = await req.json()
        console.log(res.data.items[0])
        const tmp = res.data.items.map((item) => {
          usrTrackObj[item.id] = true
          return {
            name: item.name,
            playlistId: item.id,
            trackCount: item.tracks,
            trackTotal: item.tracks.total,
            reqCount: Math.round(item.tracks.total / 100 + 0.5),
            owner: item.owner,
            image: item?.images[0]?.url,
            description: item.description,
          }
        })
        setUserPlaylists([...tmp])

        const getForkedPlaylistsReq = await fetch(
          `api/supabase/getForkedPlaylists?id=${"aferraro1"}`
        )
        const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
        const playlists = []
        getForkedPlaylistsRes.forEach((e) => {
          if (usrTrackObj[e.playlist_id]) {
            playlists.push({
              id: e.playlist_id,
              master_id: e.master_playlist_id,
              playlist: e.playlist,
            })
          } else {
            deletedPlaylists.push(e.playlist_id)
          }
        })
        setForkedPlaylists([...playlists])

        await fetch(`api/supabase/deletePlaylists`, {
          method: "POST",
          body: JSON.stringify({
            spotify_id: user.id,
            playlistIds: deletedPlaylists,
          }),
        })
      } catch (error) {
        console.error(error)
      }
    })()
  }, [session, user])

  const handleForkPlaylist = async (playlist) => {
    try {
      const forkPlaylist = await fetch(`api/spotify/forkPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          access_token: session.access_token,
          name: playlist.name,
          reqCount: playlist.reqCount,
          owner: playlist.owner.display_name,
          master_playlist_id: playlist.playlistId,
          total: playlist.trackTotal,
        }),
      })
      const fork = await forkPlaylist.json()
      console.log(fork)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdatePlaylist = async (id, master_id) => {
    try {
      await fetch(
        `api/spotify/updateForkedPlaylist?access_token=${session.access_token}&id=${id}&master_id=${master_id}&spotify_id=${user.id}`
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Layout>
        <div className={styles.container}>
          <div className={styles.playlist__grid}>
            {userPlaylists?.map((playlist, index) => {
              return (
                //<li key={index}>
                //  <button onClick={() => handleForkPlaylist(playlist)}>
                //    {" "}
                //    {playlist.name}{" "}
                //  </button>
                //</li>
                <PlaylistCard key={index} playlist={playlist} />
              )
            })}

            {/*<ul>
          {forkedPlaylists?.map((fork, index) => {
            return (
              <li key={index}>
                <button
                  onClick={() => handleUpdatePlaylist(fork.id, fork.master_id)}
                >
                  {" "}
                  {fork.playlist.name}{" "}
                </button>
              </li>
            )
          })}
        </ul>*/}
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Fork
