// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const { access_token, id } = req.query
  const baseURI = `https://api.spotify.com/v1/audio-analysis/${id}/`

  try {
    const resp = await fetch(baseURI, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await resp.json()
    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}
