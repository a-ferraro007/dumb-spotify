import Arrow from "./SVG/Arrow"
import styles from "../styles/Header.module.css"
import { usePlaylist } from "../context/playlist"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Profile from "./SVG/Profile"
import { useAuth } from "../context/auth"

const Header = ({ props }) => {
  const { radioBtnState, handleSetRadioBtn } = usePlaylist()
  const [hideBtn, setHideBtn] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  console.log(router)

  useEffect(() => {
    console.log(user)
    if (router.route.includes("/playlists/")) {
      setHideBtn(true)
    }
  }, [router, user])

  return (
    <div className={styles.header}>
      {user ? (
        <>
          <div className={styles.header__left}>
            {!hideBtn ? (
              <>
                <input
                  type="radio"
                  id="liked"
                  name="playlist"
                  value="liked"
                  checked={radioBtnState === "liked"}
                  onChange={(e) => handleSetRadioBtn(e.target.value)}
                  className={styles.input}
                />
                <label
                  htmlFor="liked"
                  className={styles.btn__group_option}
                  style={
                    radioBtnState === "liked" ? { background: "#333" } : {}
                  }
                >
                  liked
                </label>

                <input
                  type="radio"
                  id="forked"
                  name="playlist"
                  value="forked"
                  checked={radioBtnState === "forked"}
                  onChange={(e) => handleSetRadioBtn(e.target.value)}
                  className={styles.input}
                />
                <label
                  htmlFor="forked"
                  className={styles.btn__group_option}
                  style={
                    radioBtnState === "forked" ? { background: "#333" } : {}
                  }
                >
                  forked
                </label>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.header__right}>
            <button className={styles.header__profileBtn}>
              {" "}
              <div className={styles.header__icon}>
                <Profile />
              </div>
              <span className={styles.header__profileName}>
                {" "}
                {user.display_name}{" "}
              </span>
              <Arrow
                classNam={styles.header__Arrow}
                style={styles.header__Arrow}
              />
            </button>
          </div>
        </>
      ) : (
        <> </>
      )}{" "}
    </div>
  )
}

export default Header
