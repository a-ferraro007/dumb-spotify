import Image from "next/image"
import styles from "../styles/PlaylistCard.module.css"
import { useRouter } from "next/router"
import { usePlaylist } from "../context/playlist"
import Music from "./SVG/Music"

const PlaylistCard = ({ playlist, fork, master }) => {
  const router = useRouter()
  const { handleSetPlaylist, handleSetMasterId } = usePlaylist()

  return (
    <button
      onClick={() => {
        console.log("card click", playlist)

        if (fork) {
          playlist.isFork = true
          handleSetPlaylist(playlist)
          handleSetMasterId(master)
        } else {
          playlist.isFork = false
          handleSetPlaylist(playlist)
        }
        router.push(`/playlists/${playlist.playlistId}`)
      }}
      className={styles.unstyled__btn}
    >
      <div className={styles.card}>
        <div className={styles.card__top}>
          {!playlist.image ? (
            <Music width={150} height={150} />
          ) : (
            <Image
              src={playlist.image ? playlist.image : "/symbol.svg"}
              width={150}
              height={150}
              layout="fixed"
              quality="100"
              placeholder="blur"
              blurDataURL="/symbol.svg"
              className={styles.playlist__image}
            ></Image>
          )}
        </div>
        <div className={styles.card__bottom}>
          <span className={styles.card__heading}> {playlist.name}</span>
        </div>
      </div>
    </button>
  )
}

export default PlaylistCard
