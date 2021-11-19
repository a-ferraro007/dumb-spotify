import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getNewAuthTokens } from "../lib/auth/authorize"
import { getCookie } from "../lib/getCookie"
import { useAuth } from "../context/auth"
import styles from "../styles/Home.module.css"
//import { supabase } from "../lib/supabase"

const Home = () => {
  const router = useRouter()
  //const { session, loading } = useAuth()
  const [refreshToken, setRefreshToken] = useState({})
  const [session, setSession] = useState({ access_token: null })
  const [userPlaylists, setUserPlaylists] = useState([])
  const [showTracks, setShowTracks] = useState(true)
  //const [userId, setUserID] = useState("")

  useEffect(() => {
    const token = getCookie("refresh_token")
    if (token) {
      ;(async () => {
        const newSession = await getNewAuthTokens(refreshToken)
        setSession(newSession)
      })()
      setRefreshToken(token)
    }
  }, [])

  useEffect(() => {
    if (!session.access_token) return
    ;(async () => {
      try {
        const req = await fetch(
          `api/getUserPlaylists?access_token=${session.access_token}`
        )
        const res = await req.json()

        const tmp = res.data.items.map((item) => {
          return {
            name: item.name,
            playlistId: item.id,
            trackCount: item.tracks,
            trackTotal: item.tracks.total,
            reqCount: Math.round(item.tracks.total / 100 + 0.5),
            owner: item.owner,
          }
        })
        setUserPlaylists([...tmp])

        const getForkedPlaylistsReq = await fetch(
          `api/supabase/getForkedPlaylists`
        )
        const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
        console.log(getForkedPlaylistsRes[0])
      } catch (error) {
        console.error(error)
      }
    })()
  }, [session])

  const handleForkPlaylist = async (playlist) => {
    try {
      const getUris = await fetch(
        `api/getTracksList?access_token=${session.access_token}&id=${playlist.playlistId}&reqCount=${playlist.reqCount}&total=${playlist.trackTotal}`
      )

      const getUrisRes = await getUris.json()
      const trackUris = getUrisRes.tracks.map((item) => {
        return item.track.uri
      })

      const createPlaylist = await fetch(`api/createPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          access_token: session.access_token,
          uris: trackUris,
          total: trackUris.length,
          name: playlist.name,
          reqCount: playlist.reqCount,
          owner: playlist.owner.display_name,
        }),
      })

      const { id } = await createPlaylist.json()
      const addForkToDBReq = await fetch(`api/supabase/forkPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          playlist_id: id,
          master_playlist_id: playlist.playlistId,
          spotify_id: "aferraro1",
          uris: { tracks: trackUris },
        }),
      })
      await addForkToDBReq.json()
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
                  <button onClick={() => handleForkPlaylist(playlist)}>
                    {" "}
                    {playlist.name}{" "}
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
