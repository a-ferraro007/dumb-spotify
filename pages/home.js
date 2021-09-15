import { useEffect, useState } from 'react'
import Voronoi from '../components/Voronoi'
import { getNewAuthTokens } from '../lib/auth/authorize'
import { getCookie } from '../lib/getCookie'
import styles from '../styles/Home.module.css'

const Home = () => {
  const [userPlaylists, setUserPlaylists] = useState([])
  const [currentTrackListing, setCurrentTrackListing] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [showTracks, setShowTracks] = useState(true)
  const [showPattern, setShowPattern] = useState(false)

  useEffect(() => {
    const refreshToken = getCookie('refresh_token')
    ;(async () => {
      if (!refreshToken) console.log(refreshToken)
      try {
        const data = await getNewAuthTokens()
        console.log('accessToken', data)
        const req = await fetch(
          `api/getUserPlaylists?access_token=${data.access_token}`
        )
        const res = await req.json()
        const tmp = res.data.items.map((item) => {
          return {
            name: item.name,
            playlistId: item.id,
            trackCount: item.tracks,
            tracksListObj: item.tracks.total
          }
        })
        setUserPlaylists([...tmp])
        console.log(res)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  const handleGetTracksList = async (id) => {
    try {
      const data = await getNewAuthTokens()
      console.log('accessToken', data)
      const req = await fetch(
        `api/getTracksList?access_token=${data.access_token}&id=${id}`
      )
      const res = await req.json()
      const tmp = res.data.items.map((item) => {
        return {
          name: item.track.name,
          trackId: item.track.id,
          artistArray: item.track.artists
        }
      })
      setCurrentTrackListing([...tmp])
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectTrack = async (id) => {
    setIsCreating(true)
    setShowTracks(false)
    try {
      const data = await getNewAuthTokens()
      console.log('accessToken', data)
      const req = await fetch(
        `api/getTrackAnalysis?access_token=${data.access_token}&id=${id}`
      )
      const res = await req.json()
      console.log(res)
      setTimeout(() => {
        setIsCreating(false)
        setShowPattern(true)
      }, 3000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {showTracks ? (
        <div className={styles.homeContainer}>
          <ul>
            {userPlaylists?.map((playlist, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={() => handleGetTracksList(playlist.playlistId)}
                  >
                    {' '}
                    {playlist.name}{' '}
                  </button>
                </li>
              )
            })}
          </ul>
          <ul>
            {currentTrackListing?.map((track, index) => {
              return (
                <li key={index}>
                  <button onClick={() => handleSelectTrack(track.trackId)}>
                    {' '}
                    {track.name}{' '}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
      {isCreating ? <div>CREATING....</div> : <> </>}
      {showPattern ? <Voronoi /> : <> </>}
    </>
  )
}

export default Home
