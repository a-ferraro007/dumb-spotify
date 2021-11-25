import React from "react"
import Image from "next/image"
import styles from "../styles/PlaylistCard.module.css"

const PlaylistCard = ({ playlist }) => {
  const handlePlaylistClick = () => {
    console.log("click", playlist)
  }

  return (
    <button onClick={handlePlaylistClick} className={styles.unstyled__btn}>
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
