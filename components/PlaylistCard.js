import Image from "next/image"
import styles from "../styles/PlaylistCard.module.css"
import { useRouter } from "next/router"
import { usePlaylist } from "../context/playlist"

const PlaylistCard = ({ playlist, fork, master }) => {
  const router = useRouter()
  const { handleSetPlaylist, handleSetIsFork, handleSetMasterId } =
    usePlaylist()

  return (
    <button
      onClick={() => {
        console.log("card click", playlist)
        handleSetPlaylist(playlist)
        if (fork) {
          handleSetIsFork(fork)
          handleSetMasterId(master)
        }
        router.push("/playlist")
      }}
      className={styles.unstyled__btn}
    >
      <div className={styles.card}>
        <div className={styles.card__top}>
          <Image
            src={playlist.image ? playlist.image : "/placeholder.png"}
            width={200}
            height={150}
            layout="responsive"
            quality="100"
            placeholder="blur"
            blurDataURL="/placeholder.png"
            className={styles.playlist__image}
          ></Image>
        </div>
        <div className={styles.card__bottom}>
          <span className={styles.card__heading}> {playlist.name}</span>
        </div>
      </div>
    </button>
  )
}

export default PlaylistCard
