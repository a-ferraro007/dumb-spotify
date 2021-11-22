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
  //const { access_token, id } = req.query
  //let { total, reqCount } = req.query
  console.log(access_token)
  const promiseArray = []
  let offset = 0
  console.log(id)
  for (let index = 0; index < reqCount; index++) {
    //console.log("total", total)
    //console.log("offset" + offset)

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
      .catch((err) => {
        //console.log()
        console.log("ere", err)
      })

    promises.forEach((chunk) => {
      tracks.push(...chunk.items)
    })

    return tracks
  } catch (error) {
    console.error("eeee", error)
    res.status(400)
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
      console.log(error)
      throw error
    })

  all.forEach((chunk) => {
    console.log(chunk)
  })
}
