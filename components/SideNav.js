import styles from ".././styles/SideNav.module.css"
import Home from "./SVG/Home"
import Spotify from "./SVG/Spotify"

const SideNav = () => {
  return (
    <div className={styles.sideNav__container}>
      {/*<div className={styles.sideNav__contentContainer}>*/}
      <div className={styles.sideNav__logoContainer}>
        {" "}
        <Spotify />
      </div>
      <ul className={styles.sideNav__liContent}>
        <li className={styles.sideNav__li}>
          {" "}
          <Home />{" "}
        </li>
      </ul>
      {/*</div>*/}
    </div>
  )
}

export default SideNav
