import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Link from "next/link"
import { useAuth } from "../context/auth"
import styles from "../styles/Home.module.css"
import { usePlaylist } from "../context/playlist"
const getGreeting = () => {
  const hour = new Date(Date.now()).getHours()
  if (hour >= 17 || hour === 0) {
    return "good evening"
  } else if (hour >= 1 && hour < 12) {
    return "good morning"
  } else if (hour >= 12 && hour < 17) {
    return "good afternoon"
  }
}

export async function getServerSideProps(context) {
  const { access_token, refresh_token, user } = context.req.cookies
  if (!user || !refresh_token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: JSON.parse(user),
      session: { access_token: access_token ?? null, refresh_token },
    },
  }
}

const index = ({ user, session }) => {
  const { handleSetRadioBtn, mood, handleSetMood } = usePlaylist()
  const { setUser, setSession } = useAuth()
  const [greeting] = useState(getGreeting())

  useEffect(() => {
    setUser(user)
    setSession(session)
  }, [])

  useEffect(() => {
    handleSetMood("rgb(83, 83, 83)")
  }, [])

  const handleMouseOverLiked = () => {
    handleSetMood("rgb(80, 40, 240)")
  }

  const handleMouseOverForked = () => {
    handleSetMood("rgb(248, 160, 88)")
  }

  return (
    <Layout>
      <div className={styles.container} style={{ backgroundColor: mood }}>
        <div className={styles.home__container}>
          <h1 className={styles.home__heading}> {greeting} </h1>

          <div className={styles.home__cardContainer}>
            <div
              className={styles.home__card}
              onMouseOver={handleMouseOverLiked}
            >
              <Link href="/collection/playlists">
                <a onClick={() => handleSetRadioBtn("liked")}>
                  liked playlists
                </a>
              </Link>
            </div>
            <div
              className={styles.home__card}
              onMouseOver={handleMouseOverForked}
            >
              {" "}
              <Link href="/collection/playlists">
                <a onClick={() => handleSetRadioBtn("forked")}>
                  forked playlists
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default index
