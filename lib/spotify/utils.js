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
  try {
    const req = await fetch(
      `${process.env.BASE_URL}/api/auth/token/refresh/${refreshToken}`
    )
    const { access_token, expires_in } = await req.json()

    if (access_token) {
      return {
        access_token,
        expires_in,
      }
    } else {
      throw new Error(`Error returning Access Token`)
    }
  } catch (error) {
    throw new Error(error)
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
