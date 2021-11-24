import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "../context/auth"
import Loading from "../components/loading"
import styles from "../styles/Callback.module.css"

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
  return (
    <div className={styles.container}>
      <h1 className={styles.loading_text}>generating auth tokens </h1>
      <Loading />
    </div>
  )
}

export default callback
