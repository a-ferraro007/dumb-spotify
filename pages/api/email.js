import sgMail from "@sendgrid/mail"
import { supabase } from "../../lib/supabase/client"
sgMail.setApiKey(process.env.SEND_GRID)

export default async (req, res) => {
  const { email } = req.body

  const msg = {
    to: email,
    from: "really@dumbspotify.com",
    subject: "You really signed up for this? Yikes.",
    text: "Welcome to the dumb spotify waitlist, I'll email you if I ever finish...",
    html: `<strong>Welcome to the dumb spotify waitlist!</strong> <br>
    <span>We'll email you again if we ever release this thing...  </span>`,
  }
  try {
    const { data, error } = await supabase.from("beta_signups").insert([
      {
        email,
      },
    ])
    if (error) {
      throw error
    }

    await sgMail.send(msg)
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(400).json(error)
  }
}
