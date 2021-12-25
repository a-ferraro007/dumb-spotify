import { useMutation, useQueryClient } from "react-query"

const updateForkedPlaylist = async ({
  accessToken,
  playlist,
  masterId,
  userId,
}) => {
  try {
    const resp = await fetch(
      `/api/spotify/updateForkedPlaylist?access_token=${accessToken}&id=${playlist?.playlistId}&master_id=${masterId}&spotify_id=${userId}`
    )
    if (!resp.ok) throw new Error("error updating playlist")
    return await resp.json()
  } catch (error) {
    throw error
  }
}

const useUpdateForkedPlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (update) => {
      return updateForkedPlaylist({ ...update })
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("load-tracks")
      },
    }
  )
}

export { updateForkedPlaylist, useUpdateForkedPlaylist }
