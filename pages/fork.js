import { useEffect, useState } from "react"
import { getCookie } from "../lib/getCookie"
import { useAuth } from "../context/auth"
import { usePlaylist } from "../context/playlist"
import styles from "../styles/Fork.module.css"
import router from "next/router"
import PlaylistCard from "../components/PlaylistCard"
import Layout from "../components/Layout"

const Fork = () => {
  const [refreshToken, setRefreshToken] = useState({})
  const [userPlaylists, setUserPlaylists] = useState([])
  const [forkedPlaylists, setForkedPlaylists] = useState([])
  //const [radioBtnState, setRadioBtnState] = useState("liked")
  const { user, getNewAuthTokens, session } = useAuth()
  const [loading, setLoading] = useState(true)
  const { radioBtnState } = usePlaylist()

  useEffect(() => {
    console.log("rad", radioBtnState)
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
      setRefreshToken(token)
    } else {
      router.replace("/")
    }
  }, [])

  useEffect(() => {
    if (!session || !user) return
    ;(async () => {
      const deletedPlaylists = []
      const playlists = []
      const usrPlaylistObj = {}
      const forkPlaylistObj = {}
      try {
        const getForkedPlaylistsReq = await fetch(
          `api/supabase/getForkedPlaylists?id=${user.id}`
        )
        const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
        getForkedPlaylistsRes.forEach((fork) => {
          forkPlaylistObj[fork.playlist_id] = fork.playlist_id
        })

        const req = await fetch(
          `api/spotify/getUserPlaylists?access_token=${session.access_token}`
        )
        const res = await req.json()
        const usrPlaylists = res.data.items.reduce((result, playlist) => {
          usrPlaylistObj[playlist.id] = playlist.id
          if (!forkPlaylistObj[playlist.id]) {
            result.push({
              name: playlist.name,
              playlistId: playlist.id,
              trackCount: playlist.tracks,
              trackTotal: playlist.tracks.total,
              reqCount: Math.round(playlist.tracks.total / 100 + 0.5),
              owner: playlist.owner,
              image: playlist?.images[0]?.url,
              description: playlist.description,
            })
          }
          return result
        }, [])
        setUserPlaylists(usrPlaylists)

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

  return (
    <Layout props={radioBtnState}>
      {!loading ? (
        //<div className={styles.container}>
        <>
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
                  <PlaylistCard
                    key={index}
                    playlist={playlist.playlist}
                    master={playlist.master_id}
                    fork={true}
                  />
                )
              })}
            </div>
          )}
        </>
      ) : (
        <> </>
      )}
    </Layout>
  )
}

export default Fork
{
  /*<div className={styles.btn__group}>
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
  <label htmlFor="liked" className={styles.btn__group_option}>
    liked
  </label>
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
  <label htmlFor="forked" className={styles.btn__group_option}>
    forked
  </label>
</div>
</div>*/
}
