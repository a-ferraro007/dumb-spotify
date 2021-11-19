import { supabase } from "../../../lib/supabase"
export default async (req, res) => {
  const { id } = req.query
  try {
    const { data, error } = await supabase.from("forked_playlists").select("*")

    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}
