import { useEffect } from "react"
import router from "next/router"
import Layout from "../components/Layout"
import { getCookie } from "../lib/getCookie"
import { getNewAuthTokens } from "../context/auth"

const index = () => {
  useEffect(() => {
    const token = getCookie("refresh_token")
    if (token) {
      ;(async () => {
        try {
          await getNewAuthTokens(token)
        } catch (error) {
          console.log("error generating new auth token", error)
          router.replace("/")
        }
      })()
      //setRefreshToken(token)
    } else {
      router.replace("/")
    }
  }, [])

  return (
    <Layout>
      <div> </div>
    </Layout>
  )
}

export default index
