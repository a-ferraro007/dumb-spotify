import { createContext, useContext, useEffect, useState } from "react"

export const PlaylistContext = createContext({})

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState({})
  const [masterId, setMasterId] = useState("")
  const [radioBtnState, setRadioBtnState] = useState("liked")

  const handleSetPlaylist = (playlist) => {
    setPlaylist(playlist)
  }

  const handleSetMasterId = (masterId) => {
    setMasterId(masterId)
  }

  const handleSetRadioBtn = (radioBtnState) => {
    setRadioBtnState(radioBtnState)
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        masterId,
        radioBtnState,
        handleSetMasterId,
        handleSetPlaylist,
        handleSetRadioBtn,
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
