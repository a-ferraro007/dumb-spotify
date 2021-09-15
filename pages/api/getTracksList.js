// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const { access_token, id } = req.query
  console.log('auth', access_token, id)

  const baseURI = `https://api.spotify.com/v1/playlists/${id}/tracks`
  //const params = new URLSearchParams(baseURI.search)
  //params.append('grant_type', 'authorization_code')
  //params.append('code', authToken)
  //params.append('redirect_uri', process.env.redirect_uri)

  try {
    const resp = await fetch(baseURI, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log(res)
    const data = await resp.json()
    console.log(data)
    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}
