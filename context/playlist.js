import { createContext, useContext, useEffect, useState } from "react"

export const PlaylistContext = createContext({})

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState({ isFork: false })
  const [masterId, setMasterId] = useState("")
  const [radioBtnState, setRadioBtnState] = useState("liked")
  const [mood, setMood] = useState("rgb(83, 83, 83)")

  const handleSetPlaylist = (playlist) => {
    setPlaylist(playlist)
  }

  const handleSetMasterId = (masterId) => {
    setMasterId(masterId)
  }

  const handleSetRadioBtn = (radioBtnState) => {
    setRadioBtnState(radioBtnState)
  }

  const handleSetMood = (mood) => {
    setMood(mood)
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        masterId,
        radioBtnState,
        mood,
        handleSetMasterId,
        handleSetPlaylist,
        handleSetRadioBtn,
        handleSetMood,
      }}
    >
      {" "}
      {children}{" "}
    </PlaylistContext.Provider>
  )
}
export const usePlaylist = () => {
  return useContext(PlaylistContext)
}
