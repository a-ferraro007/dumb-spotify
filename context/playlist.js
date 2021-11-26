import { createContext, useContext, useEffect, useState } from "react"

export const PlaylistContext = createContext({})

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState({ playlist: null })

  const handleSetPlaylist = (playlist) => {
    setPlaylist(playlist)
  }

  return (
    <PlaylistContext.Provider value={{ playlist, handleSetPlaylist }}>
      {" "}
      {children}{" "}
    </PlaylistContext.Provider>
  )
}
export const usePlaylist = () => {
  return useContext(PlaylistContext)
}
