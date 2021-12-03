import styles from ".././styles/SideNav.module.css"
import Home from "./SVG/Home"
import Spotify from "./SVG/Spotify"

const SideNav = () => {
  return (
    <div className={styles.sideNav__container}>
      <div className={styles.sideNav__logoContainer}>
        {" "}
        <Spotify />
      </div>
      <div className={styles.sideNav__contentContainer}>
        <Home />
      </div>
    </div>
  )
}

export default SideNav
