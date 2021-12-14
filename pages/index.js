import { useEffect, useState } from "react"
import router from "next/router"
import Layout from "../components/Layout"
import Link from "next/link"
import { getCookie } from "../lib/getCookie"
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

const index = () => {
  const [bgColor, setBgColor] = useState("rgb(83, 83, 83)") //move this into context?
  const { handleSetRadioBtn, mood, handleSetMood } = usePlaylist()
  const { getNewAuthTokens } = useAuth()
  const [greeting] = useState(getGreeting())

  useEffect(() => {
    const token = getCookie("refresh_token")
    if (token) {
      ;(async () => {
        try {
          await getNewAuthTokens(token)
        } catch (error) {
          console.log("error generating new auth token", error)
          router.replace("/login")
        }
      })()
      //setRefreshToken(token)
    } else {
      router.replace("/login")
    }
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
