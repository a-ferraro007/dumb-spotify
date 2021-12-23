import { supabase } from "../supabase/client"

export const getPlaylist = async (access_token, id) => {
  try {
    const baseURI = `https://api.spotify.com/v1/playlists/${id}`
    const req = await fetch(baseURI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
    const res = await req.json()
    return res
  } catch (error) {
    console.log("GET PLAYLISTS FUNC", error)
    console.error(error)
    return error
  }
}

export const getTracks = async (access_token, id, reqCount, total) => {
  const promiseArray = []
  let offset = 0
  console.log(id)
  for (let index = 0; index < reqCount; index++) {
    const baseURI = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=${offset}`
    const req = fetch(baseURI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
    promiseArray.push(req)
    if (total > 100) {
      offset += 100
      total = total - 100
    } else {
      offset = total
    }
  }

  try {
    const tracks = []
    const promises = await Promise.all(promiseArray)
      .then((res) => {
        return Promise.all(
          res.map((response) => {
            return response.json()
          })
        )
      })
      .catch((error) => {
        throw error
      })

    promises.forEach((chunk) => {
      tracks.push(...chunk.items)
    })

    return tracks
  } catch (error) {
    console.error("error getting tracklist", error)
    return error
  }
}

export const addTracksSpotify = async (access_token, id, reqCount) => {
  const addTracksBaseURI = `https://api.spotify.com/v1/playlists/${id}/tracks`

  const size = Math.round(uris.length / reqCount)
  let chunks = uris.reduce(
    (rows, key, index) =>
      (index % size == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  )

  chunks.forEach((chunk) => {
    delay += delayIncrement
    const req = new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      fetch(addTracksBaseURI, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          uris: chunk,
        }),
      })
    )

    promiseArray.push(req)
  })

  const all = await Promise.all(promiseArray)
    .then((res) => {
      return Promise.all(
        res.map((response) => {
          return response.json()
        })
      )
    })
    .catch((error) => {
      throw error
    })

  all.forEach((chunk) => {
    console.log(chunk)
  })
}

export const createPlaylist = async (
  access_token,
  name,
  uris,
  reqCount,
  owner
) => {
  const baseURI = `https://api.spotify.com/v1/me/playlists`
  const promiseArray = []
  const delayIncrement = 500
  let delay = 0

  try {
    const resp = await fetch(baseURI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        name: `FORK: ${name}`,
        description: `This playlist is a fork of '${name}' created by ${owner}`,
        public: true,
      }),
    })
    const data = await resp.json()
    console.log("data", data)
    const addTracksBaseURI = `https://api.spotify.com/v1/playlists/${data.id}/tracks`

    const size = Math.round(uris.length / reqCount)
    let chunks = uris.reduce(
      (rows, key, index) =>
        (index % size == 0
          ? rows.push([key])
          : rows[rows.length - 1].push(key)) && rows,
      []
    )

    chunks.forEach((chunk) => {
      delay += delayIncrement
      const req = new Promise((resolve) => setTimeout(resolve, delay)).then(
        () =>
          fetch(addTracksBaseURI, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify({
              uris: chunk,
            }),
          })
      )

      promiseArray.push(req)
    })

    const all = await Promise.all(promiseArray)
      .then((res) => {
        return Promise.all(
          res.map((response) => {
            return response.json()
          })
        )
      })
      .catch((error) => {
        throw error
      })

    all.forEach((chunk) => {
      console.log(chunk)
    })
    return data
  } catch (error) {
    console.error("error creating playlist", error)
    return error
  }
}

export const updateFork = async (access_token, id, reqCount, uris) => {
  const updateTracksBaseURI = `https://api.spotify.com/v1/playlists/${id}/tracks`
  const promiseArray = []
  const delayIncrement = 500
  let delay = 0

  const size = Math.round(uris.length / reqCount)
  let chunks = uris.reduce(
    (rows, key, index) =>
      (index % size == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  )

  chunks.forEach((chunk) => {
    delay += delayIncrement
    const req = new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      fetch(updateTracksBaseURI, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          uris: chunk,
        }),
      })
    )

    promiseArray.push(req)
  })

  const all = await Promise.all(promiseArray)
    .then((res) => {
      return Promise.all(
        res.map((response) => {
          return response.json()
        })
      )
    })
    .catch((error) => {
      throw error
    })

  all.forEach((chunk) => {
    console.log(chunk)
  })
}

export const deletePlaylist = async (access_token, playlist_id) => {
  const baseURI = `https://api.spotify.com/v1/me/playlists/${playlist_id}/tracks`

  try {
    const resp = await fetch(baseURI, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    const data = await resp.json()
    return data
  } catch (error) {
    console.error("error deleting  playlist", error)
    throw error
  }
}

export const getNewAccessToken = async (refreshToken) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const baseURI = "https://accounts.spotify.com/api/token"
  const params = new URLSearchParams(baseURI.search)
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refreshToken)

  try {
    const resp = await fetch(baseURI, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
    if (!resp.ok) throw new Error("Error returning Access Token")
    const { access_token, refresh_token } = await resp.json()
    return {
      access_token,
      refresh_token,
    }
  } catch (error) {
    throw error
  }
}

export const getUserPlaylists = async (access_token) => {
  const baseURI = "https://api.spotify.com/v1/me/playlists"

  try {
    const resp = await fetch(baseURI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    const data = await resp.json()
    if (data.error?.status === 401) {
      throw new Error(data.error.message)
    }
    return data
  } catch (error) {
    console.error("error getting user playlist", error)
    throw new Error(error)
  }
}

export const loadPlaylists = async (access_token, user) => {
  console.log(user)
  const deletedPlaylists = []
  const forked = []
  const usrPlaylistObj = {}
  const forkPlaylistObj = {}
  let liked = []

  try {
    const getForkedPlaylistsRes = await supabase
      .from("forked_playlists")
      .select("playlist_id, master_playlist_id, playlist")
      .eq("spotify_id", user.id)
    if (getForkedPlaylistsRes.error) throw getForkedPlaylistsRes.error

    getForkedPlaylistsRes.data.forEach((fork) => {
      forkPlaylistObj[fork.playlist_id] = fork.playlist_id
    })

    const res = await getUserPlaylists(access_token)

    if (res.error?.status === 401) {
      console.error("res.", res.error)
      throw res.error
    }

    liked = res.items?.reduce((result, playlist) => {
      usrPlaylistObj[playlist.id] = playlist.id
      if (!forkPlaylistObj[playlist.id]) {
        result.push({
          name: playlist.name,
          playlistId: playlist.id,
          trackCount: playlist.tracks,
          trackTotal: playlist.tracks.total,
          reqCount: Math.round(playlist.tracks.total / 100 + 0.5),
          owner: playlist.owner,
          image: playlist?.images[0]?.url ?? null,
          description: playlist.description,
        })
      }
      return result
    }, [])

    getForkedPlaylistsRes.data.forEach((e) => {
      if (usrPlaylistObj[e.playlist_id]) {
        forked.push({
          id: e.playlist_id,
          master_id: e.master_playlist_id,
          playlist: e.playlist,
        })
      } else {
        deletedPlaylists.push(e.playlist_id)
      }
    })

    if (deletePlaylist.length) {
      const del = await supabase
        .from("forked_playlists")
        .delete()
        .in("playlist_id", [...deletedPlaylists])
        .eq("spotify_id", user.id)
      if (del?.error) throw del?.error
    }
  } catch (error) {
    console.error("errorrrrr", error)
    throw error
  }

  console.log("return", forked.length, liked.length)
  return {
    forked,
    liked,
  }
}
