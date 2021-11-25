import { useEffect, useState } from "react"
import { getCookie } from "../lib/getCookie"
import { useAuth } from "../context/auth"
import styles from "../styles/Fork.module.css"
import router from "next/router"
import PlaylistCard from "../components/PlaylistCard"
import Layout from "../components/Layout"

const Fork = () => {
  const [refreshToken, setRefreshToken] = useState({})
  const [userPlaylists, setUserPlaylists] = useState([])
  const [forkedPlaylists, setForkedPlaylists] = useState([])
  const [radioBtnState, setRadioBtnState] = useState("liked")
  const { user, getNewAuthTokens, session } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getCookie("refresh_token")
    if (token) {
      ;(async () => {
        try {
          await getNewAuthTokens(refreshToken)
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
    if (!session || !user) return
    ;(async () => {
      const usrPlaylistObj = {}
      const deletedPlaylists = []
      try {
        const req = await fetch(
          `api/spotify/getUserPlaylists?access_token=${session.access_token}`
        )
        const res = await req.json()
        console.log(res.data.items[0])
        const tmp = res.data.items.map((item) => {
          usrPlaylistObj[item.id] = true
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
          `api/supabase/getForkedPlaylists?id=${user.id}`
        )
        const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
        const playlists = []
        getForkedPlaylistsRes.forEach((e) => {
          if (usrPlaylistObj[e.playlist_id]) {
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

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [session])

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
        {!loading ? (
          <div className={styles.container}>
            <div className={styles.btn__group}>
              <span className={styles.btn__group_label}> playlists: </span>
              <div>
                <input
                  type="radio"
                  id="liked"
                  name="playlist"
                  value="liked"
                  checked={radioBtnState === "liked"}
                  onChange={(e) => setRadioBtnState(e.target.value)}
                  className={styles.input}
                />
                <label className={styles.btn__group_option}>liked</label>
              </div>
              <div>
                {" "}
                <input
                  type="radio"
                  id="forked"
                  name="playlist"
                  value="forked"
                  checked={radioBtnState === "forked"}
                  onChange={(e) => setRadioBtnState(e.target.value)}
                  className={styles.input}
                />
                <label className={styles.btn__group_option}>forked</label>
              </div>
            </div>

            {radioBtnState === "liked" ? (
              <div className={styles.playlist__grid}>
                {userPlaylists?.map((playlist, index) => {
                  return <PlaylistCard key={index} playlist={playlist} />
                })}
              </div>
            ) : (
              <div className={styles.playlist__grid}>
                {forkedPlaylists?.map((playlist, index) => {
                  return (
                    <PlaylistCard key={index} playlist={playlist.playlist} />
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <> </>
        )}
      </Layout>
    </>
  )
}

export default Fork
