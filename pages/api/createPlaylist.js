export default async (req, res) => {
  const {access_token, name, uris, reqCount} =  JSON.parse(req.body)
  const baseURI = `https://api.spotify.com/v1/me/playlists`
  const promiseArray = []
  const delayIncrement = 500
  let delay = 0

  try {
    const resp = await fetch(baseURI, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        "name": `FORK: ${name}`,
        "description": `This playlist is a fork of '${name}'`,
        "public": true
      })
    })
    const data = await resp.json()

    const addTracksBaseURI = `https://api.spotify.com/v1/playlists/${data.id}/tracks`

    const size = Math.round(uris.length / reqCount)
    let chunks = uris.reduce((rows, key, index) => (index % size == 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, [])

    chunks.forEach((chunk) => {
      delay += delayIncrement
      const req = new Promise(resolve => setTimeout(resolve, delay)).then(() =>
      fetch(addTracksBaseURI, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          uris: chunk
        })
      }))

      promiseArray.push(req)
    })

    const all = await Promise.all(promiseArray).then((res) => {
      return Promise.all(res.map((response)=> {
        return response.json()
      }))
    }).catch((error) => {
      console.log(error)
      throw error
    })

    all.forEach((chunk) => {
      console.log(chunk)
    })

    return res.status(200).json({ 'success': true  })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}