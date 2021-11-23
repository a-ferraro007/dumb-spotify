import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../context/auth"
//import { getAuthTokens } from "../lib/auth/authorize"

const callback = () => {
  const router = useRouter()
  const { getAuthTokens } = useAuth()
  useEffect(() => {
    const { code } = router.query
    if (code) {
      ;(async () => {
        try {
          await getAuthTokens(router, code)
        } catch (error) {
          console.error(error)
          router.replace("/")
        }
      })()
    }
  }, [router.query])
  return <div> Getting Authentication Tokens... </div>
}

export default callback
