import Arrow from "./SVG/Arrow"
import styles from "../styles/Header.module.css"
import { usePlaylist } from "../context/playlist"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Profile from "./SVG/Profile"
import { useAuth } from "../context/auth"
import LinkOut from "./SVG/LinkOut"

const Header = ({ props }) => {
  const { radioBtnState, handleSetRadioBtn, playlist } = usePlaylist()
  const [showBtnBar, setShowBtnBar] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, handleLogOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (router.pathname === "/collection/playlists") setShowBtnBar(true)
  }, [router, user])

  useEffect(() => {
    console.log("header", playlist)
  }, [playlist])

  return (
    <div className={styles.header}>
      {user ? (
        <>
          <div className={styles.header__left}>
            {showBtnBar ? (
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
            <button
              className={styles.header__profileBtn}
              onClick={() => {
                setShowDropdown(!showDropdown)
              }}
            >
              {" "}
              <div className={styles.header__icon}>
                <Profile />
              </div>
              <span className={styles.header__profileName}>
                {" "}
                {user.display_name}{" "}
              </span>
              <Arrow
                className={styles.header__Arrow}
                style={styles.header__Arrow}
                active={showDropdown}
              />
            </button>
          </div>
          {showDropdown ? (
            <div className={styles.header__dropdown}>
              <div>
                <ul className={styles.header__dropdownUl}>
                  <li className={styles.header__dropdownLi}>
                    <a
                      className={styles.header__dropdownLink}
                      href="https://open.spotify.com/"
                      target="_blank"
                    >
                      <span className={styles.header__dropdownLinkText}>
                        {" "}
                        account{" "}
                      </span>
                      <LinkOut />
                    </a>
                  </li>
                  <li className={styles.header__dropdownLi}>
                    <button
                      className={styles.header__dropdownLink}
                      onClick={handleLogOut}
                    >
                      log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <> </>
      )}{" "}
    </div>
  )
}

export default Header
