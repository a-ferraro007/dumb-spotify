//import { playlistsProps } from "../../lib/spotify/serverProps"
import { useQuery } from "react-query"

const loadPlaylists = async (access_token, user) => {
  try {
    const req = await fetch(`/api/spotify/loadPlaylists`, {
      method: "POST",
      body: JSON.stringify({
        access_token,
        user,
      }),
    })
    if (!req.ok) throw new Error(req.error)
    const playlists = await req.json()

    return playlists
  } catch (error) {
    console.error("err ", error)
    throw error
  }
}

const useLoadPlaylists = (access_token, user) => {
  return useQuery(["load-playlists", { access_token, user }], () =>
    loadPlaylists(access_token, user)
  )
}

export { loadPlaylists, useLoadPlaylists }
