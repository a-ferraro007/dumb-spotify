import { createContext, useContext, useEffect, useState } from "react"

export const PlaylistContext = createContext({})

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState({})
  const [isFork, setIsFork] = useState(false)
  const [masterId, setMasterId] = useState("")

  const handleSetPlaylist = (playlist) => {
    setPlaylist(playlist)
  }

  const handleSetIsFork = (isFork) => {
    setIsFork(isFork)
  }

  const handleSetMasterId = (masterId) => {
    setMasterId(masterId)
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        isFork,
        masterId,
        handleSetIsFork,
        handleSetMasterId,
        handleSetPlaylist,
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
