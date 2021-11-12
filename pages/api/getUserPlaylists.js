// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const { access_token } = req.query
  console.log('auth', access_token)

  //const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const baseURI = 'https://api.spotify.com/v1/me/playlists'
  //const params = new URLSearchParams(baseURI.search)
  //params.append('grant_type', 'authorization_code')
  //params.append('code', authToken)
  //params.append('redirect_uri', process.env.redirect_uri)

  try {
    const resp = await fetch(baseURI, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      //body: params
    })
    //console.log(res)
    const data = await resp.json()
    //console.log(data)
    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}
