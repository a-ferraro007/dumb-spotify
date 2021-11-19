export default async (req, res) => {
  const { access_token, id } = req.query
  let { total, reqCount } = req.query
  const promiseArray = []
  let offset = 0
  console.log(id)
  for (let index = 0; index < reqCount; index++) {
    console.log("total", total)
    console.log("offset" + offset)

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
        //console.log("ere")
        //console.log(err)
      })

    promises.forEach((chunk) => {
      tracks.push(...chunk.items)
    })

    res.status(200).json({ tracks })
  } catch (error) {
    console.error("e", error)
    res.status(400)
  }
}
