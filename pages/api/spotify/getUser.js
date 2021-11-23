export default async (req, res) => {
  const { access_token } = req.query
  const baseURI = "https://api.spotify.com/v1/me"

  try {
    const resp = await fetch(baseURI, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    const user = await resp.json()

    res.status(200).json({ user })
  } catch (error) {
    console.error("error getting user", error)
    res.status(400).json(error)
  }
}
