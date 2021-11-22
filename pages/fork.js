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
  const [forkedPlaylists, setForkedPlaylists] = useState([])
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
    console.log(session)
    if (!session.access_token) return
    ;(async () => {
      try {
        const req = await fetch(
          `api/spotify/getUserPlaylists?access_token=${session.access_token}`
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
          `api/supabase/getForkedPlaylists?id=${"aferraro1"}`
        )
        const getForkedPlaylistsRes = await getForkedPlaylistsReq.json()
        console.log(getForkedPlaylistsRes)
        let n = getForkedPlaylistsRes.map((e) => {
          return {
            id: e.playlist_id,
            master_id: e.master_playlist_id,
            playlist: e.playlist,
          }
        })
        setForkedPlaylists([...n])
      } catch (error) {
        console.error(error)
      }
    })()
  }, [session])

  const handleForkPlaylist = async (playlist) => {
    try {
      const forkPlaylist = await fetch(`api/spotify/forkPlaylist`, {
        method: "POST",
        body: JSON.stringify({
          access_token: session.access_token,
          name: playlist.name,
          reqCount: playlist.reqCount,
          owner: playlist.owner.display_name,
          master_playlist_id: playlist.playlistId,
          total: playlist.trackTotal,
        }),
      })
      const fork = await forkPlaylist.json()
      console.log(fork)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdatePlaylist = async (id, master_id) => {
    console.log(id, master_id, session)
    try {
      const updatePlaylistReq = await fetch(
        `api/spotify/updateForkedPlaylist?access_token=${
          session.access_token
        }&id=${id}&master_id=${master_id}&spotify_id=${"aferraro1"}`
      )
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
          <ul>
            {forkedPlaylists?.map((fork, index) => {
              return (
                <li key={index}>
                  <button
                    onClick={() =>
                      handleUpdatePlaylist(fork.id, fork.master_id)
                    }
                  >
                    {" "}
                    {fork.playlist.name}{" "}
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
