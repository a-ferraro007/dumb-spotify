// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const { access_token, id } = req.query
  console.log('auth', access_token, id)

  const baseURI = `https://api.spotify.com/v1/audio-analysis/${id}/`

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
