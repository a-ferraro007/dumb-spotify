export default async (req, res) => {
  const { access_token, id } = req.query
  let { total, reqCount } = req.query
  const promiseArray = []
  let offset = 0

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

    res.status(200).json({ tracks })
  } catch (error) {
    console.error("error getting track list", error)
    res.status(400).json(error)
  }
}
