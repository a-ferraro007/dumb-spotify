import { useEffect, useState } from "react"
import { useAuth } from "../../context/auth"
import { usePlaylist } from "../../context/playlist"
import styles from "../../styles/Fork.module.css"
import PlaylistCard from "../../components/PlaylistCard"
import Layout from "../../components/Layout"
import { playlistsProps } from "../../lib/spotify/serverProps"

export async function getServerSideProps(context) {
  const { access_token, refresh_token, user } = context.req.cookies
  if (!user || !refresh_token)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  let playlist
  try {
    playlist = await playlistsProps(
      access_token,
      refresh_token,
      JSON.parse(user)
    )
  } catch (error) {
    console.error("error srver side playlists", error)
  }

  return {
    props: {
      forked: playlist.forked,
      liked: playlist.liked,
      usr: JSON.parse(user),
      propSession: { access_token, refresh_token },
    },
  }
}

const Playlist = ({ forked, liked, usr, propSession }) => {
  const [userPlaylists, setUserPlaylists] = useState(liked)
  const [forkedPlaylists, setForkedPlaylists] = useState(forked)
  const { setUser, setSession } = useAuth()
  const { radioBtnState } = usePlaylist()

  useEffect(() => {
    setUser(usr)
    setSession(propSession)
  }, [])

  //useEffect(() => {
  //  console.log("rad", radioBtnState)
  //  const token = getCookie("refresh_token")
  //  if (token) {
  //    ;(async () => {
  //      try {
  //        await getNewAuthTokens(token)
  //      } catch (error) {
  //        console.log("error generating new auth token", error)
  //        router.replace("/login")
  //      }
  //    })()
  //    setRefreshToken(token)
  //  } else {
  //    router.replace("/login")
  //  }
  //}, [])

  return (
    <Layout props={radioBtnState}>
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
    </Layout>
  )
}

export default Playlist
