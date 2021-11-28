import styles from ".././styles/TrackInfo.module.css"
import Image from "next/image"

const TrackList = ({ tracks }) => {
  return (
    <div className={styles.tracklist__container}>
      <div className={styles.tracklist__grid}>
        <span className={styles.tracklist__cell}>#</span>
        <span className={styles.tracklist__cell}>Title</span>
        <span className={styles.tracklist__cell}>Artist</span>
      </div>

      {tracks.map((track, index) => {
        return (
          <div className={styles.tracklist__grid} key={index}>
            <span className={styles.tracklist__cell}>{index} </span>
            <div className={styles.tracklist__cell}>
              <div className={styles.track__image}>
                <Image
                  src={
                    track.album.images[2]
                      ? track.album.images[2].url
                      : "/placeholder.png"
                  }
                  width={36}
                  height={36}
                  layout="responsive"
                  quality="100"
                  className={styles.playlist__image}
                />{" "}
              </div>
              <span className={styles.track__name}>{track.name}</span>
            </div>
            <span className={styles.tracklist__cell}>
              {track.artists[0].name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default TrackList
