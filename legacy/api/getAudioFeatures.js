import { formatPrefix } from 'd3'

export default async (req, res) => {
  const { access_token, id } = req.query
  console.log('auth', access_token, id)

  const baseURI = `https://api.spotify.com/v1/audio-features/${id}/`

  try {
    const resp = await fetch(baseURI, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await resp.json()
    const formed = {}

    const keys = [
      'duration_ms',
      'danceability',
      'energy',
      'key',
      'loudness',
      'liveness',
      'tempo',
      'mode',
      'valence'
    ]
    keys.forEach((key) => {
      formed[key] = data[key]
    })

    console.log(formed)
    res.status(200).json({ full: data, formed })
  } catch (error) {
    console.error(error)
    res.status(400)
  }
}
