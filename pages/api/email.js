const Mailjet = require("node-mailjet")
import { supabase } from "../../lib/supabase/client"
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
})

export default async (req, res) => {
  const { email } = req.body
  try {
    const { data, error } = await supabase.from("beta_signups").insert([
      {
        email,
      },
    ])
    if (error) {
      throw error
    }

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "really@dumbspotify.com",
            Name: "Gerald",
          },
          To: [
            {
              Email: `${email}`,
            },
          ],
          Subject: "You really signed up for this? Yikes.",
          TextPart:
            "Welcome to the dumb spotify waitlist, I'll email you if I ever finish...",
          HTMLPart: `<strong>Welcome to the dumb spotify waitlist!</strong> <br>
            <span>We'll email you again if we ever release this thing...  </span>
            <br>
            <span> please dont sue me. </span>`,
        },
      ],
    })
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(400).json(error)
  }
}
