import { useEffect, useState } from 'react'
import { getNewAuthTokens } from '../lib/auth/authorize'
import { getCookie } from '../lib/getCookie'
import styles from '../styles/Home.module.css'

const Home = () => {
  const [userPlaylists, setUserPlaylists] = useState([])
  const [showTracks, setShowTracks] = useState(true)

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
            trackTotal: item.tracks.total,
            reqCount: Math.round((item.tracks.total / 100) + .5)
          }
        })
        setUserPlaylists([...tmp])
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  const handleForkPlaylist = async (playlist) => {
    const data = await getNewAuthTokens()

    try {
      const getUris = await fetch(
        `api/getTracksList?access_token=${data.access_token}&id=${playlist.playlistId}&reqCount=${playlist.reqCount}&total=${playlist.trackTotal}`
      )

      const getUrisRes = await getUris.json()
      const trackUris = getUrisRes.tracks.map((item) => {
        return  item.track.uri
      })

      const createPlaylist = await fetch(`api/createPlaylist`, {
        method:"POST",
        body: JSON.stringify({
          access_token: data.access_token,
          uris: trackUris,
          total: trackUris.length,
          name: playlist.name,
          reqCount: playlist.reqCount
        })}
      )
      await createPlaylist.json()

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
                    onClick={() => handleForkPlaylist(playlist)}
                    >
                    {' '}
                    {playlist.name}{' '}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <></>
        )}
    </>
  )
}

export default Home

//const [currentTrackListing, setCurrentTrackListing] = useState([])
//const [isCreating, setIsCreating] = useState(false)
//const [showPattern, setShowPattern] = useState(false)
//const [formedData, setFormedData] = useState()
//const [analysisData, setAnalysisData] = useState()
//const handleSelectTrack = async (id) => {
//  setIsCreating(true)
//  setShowTracks(false)
//  try {
//    const data = await getNewAuthTokens()
//    console.log('accessToken', data)
//    const req = await fetch(
//      `api/getAudioAnalysis?access_token=${data.access_token}&id=${id}`
//    )
//    const featuresReq = await fetch(
//      `api/getAudioFeatures?access_token=${data.access_token}&id=${id}`
//    )
//    const res = await req.json()
//    const featuresRes = await featuresReq.json()
//    setFormedData(featuresRes.formed)
//    setAnalysisData(res.data)
//    console.log(res)

//    setTimeout(() => {
//      setIsCreating(false)
//      setShowPattern(true)
//    }, 1000)
//  } catch (error) {
//    console.error(error)
//  }
//}