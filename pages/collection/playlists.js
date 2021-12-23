import { useEffect, useState } from "react"
import { useAuth } from "../../context/auth"
import { usePlaylist } from "../../context/playlist"
import styles from "../../styles/Fork.module.css"
import PlaylistCard from "../../components/PlaylistCard"
import Layout from "../../components/Layout"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { loadPlaylists } from "../../lib/spotify/utils"
import { useLoadPlaylists } from "../../hooks"

export async function getServerSideProps(context) {
  const qc = new QueryClient()
  const { refresh_token } = context.req.cookies
  const cookie = context.req.cookies
  const user = JSON.parse(cookie.user)
  let access_token = context.req.cookies.access_token
  const header = context.res.getHeader("Set-Cookie")

  //need to check the set cookie header if the new access token
  //comes from refreshing the current page
  if (header) {
    access_token = header[0]
      .split(";")
      .find((row) => row.includes("access_token="))
      ?.split("=")[1]
  }

  if (!user || !refresh_token)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }

  try {
    await qc.fetchQuery(
      ["load-playlists", { access_token, user }],
      () => {
        return loadPlaylists(access_token, user)
      },
      { staleTime: 5000 }
    )
  } catch (error) {
    console.error("playlist error", error)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: user,
      propSession: {
        access_token,
        refresh_token,
      },
      dehydratedState: dehydrate(qc),
    },
  }
}

const Playlist = ({ user, propSession }) => {
  const { setUser, setSession } = useAuth()
  const { radioBtnState } = usePlaylist()
  const { data, isLoading, isFetching } = useLoadPlaylists(
    propSession.access_token,
    user
  )

  useEffect(() => {
    setUser(user)
    setSession(propSession)
  }, [])

  return (
    <Layout props={radioBtnState}>
      <>
        {radioBtnState === "liked" ? (
          <div className={styles.playlist__grid}>
            {data?.liked?.map((playlist, index) => {
              return <PlaylistCard key={index} playlist={playlist} />
            })}
          </div>
        ) : (
          <div className={styles.playlist__grid}>
            {data?.forked?.map((playlist, index) => {
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
