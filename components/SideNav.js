import styles from ".././styles/SideNav.module.css"
import Home from "./SVG/Home"
import Library from "./SVG/Library"
import Spotify from "./SVG/Spotify"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"

const SideNav = () => {
  const router = useRouter()

  return (
    <div className={styles.sideNav__container}>
      <Link href="/">
        <a className={styles.sideNav__logoContainer}>
          <Spotify />
        </a>
      </Link>
      <ul className={styles.sideNav__liContent}>
        <li
          className={`${styles.sideNav__li} ${
            router.pathname === "/" ? styles.sideNav__liActive : ""
          }`}
        >
          <Link href="/">
            <a className={styles.sideNav__liLink}>
              <Home />
              <span className={`${styles.sideNav__liText} `}> home </span>
            </a>
          </Link>
        </li>
        <li
          className={`${styles.sideNav__li} ${
            router.pathname === "/collection/playlists" ||
            router.pathname.includes("/playlists/")
              ? styles.sideNav__liActive
              : ""
          }`}
        >
          <Link href="/collection/playlists">
            <a className={styles.sideNav__liLink}>
              <Library />
              <span className={`${styles.sideNav__liText} `}>
                {" "}
                your library{" "}
              </span>
            </a>
          </Link>
        </li>
      </ul>
      {/*</div>*/}
    </div>
  )
}

export default SideNav
