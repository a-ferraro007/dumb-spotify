import React from "react"
import Image from "next/image"
import { useAuth } from "../context/auth"
import styles from "../styles/PlaylistCard.module.css"

const PlaylistCard = ({ playlist }) => {
  const { session, user } = useAuth()
  const handlePlaylistClick = async () => {
    console.log(playlist)
    try {
      const forkPlaylist = await fetch(`api/spotify/forkPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          access_token: session.access_token,
          user: user.id,
          name: playlist.name,
          reqCount: playlist.reqCount,
          owner: playlist.owner.display_name,
          master_playlist_id: playlist.playlistId,
          total: playlist.trackTotal,
          image: playlist.image,
        }),
      })
      const fork = await forkPlaylist.json()
      console.log(fork)
    } catch (error) {
      console.error(error)
    }
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
