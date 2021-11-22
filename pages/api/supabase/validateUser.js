import { supabase } from "../../../lib/supabase/client"

export default async (req, resp) => {
  const { id } = JSON.parse(req.body)
  try {
    const { data, error } = await supabase
      .from("users")
      .select("spotify_id")
      .eq("spotify_id", id)
    if (error) throw error
    if (data.length === 0) {
      const { res, error } = await supabase
        .from("users")
        .insert([{ spotify_id: id }])
      console.log("res", res)
      console.log("err", error)
    }

    resp.status(200).json({ message: "Hello from Next.js!" })
  } catch (error) {
    console.error(error)
    resp.status(400).json({ error })
  }
}
