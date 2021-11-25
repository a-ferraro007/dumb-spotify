import { useRouter } from "next/router"
import styles from "../styles/Login.module.css"
import { useAuth } from "../context/auth"
import Layout from "../components/Layout"

export default function Login() {
  const router = useRouter()
  const { authorizationCode } = useAuth()

  return (
    <>
      <Layout>
        <div className={styles.container}>
          <div className={styles["o-container"]}>
            <div className={styles.container}>
              <h1 className={styles.heading}> musical guacamole</h1>
              {/*<span className={styles.subscript}>
                {" "}
                (named with ❤️ by the github){" "}
              </span>*/}
              <p className={styles.subheading}>
                musical gaucamole lets you make forks of your favorite public
                spotify playlists so you can make additions and keep it synced
                with the original.{" "}
              </p>
              <button
                className={styles.btn}
                onClick={async () => await authorizationCode(router)}
              >
                {" "}
                log in with spotify{" "}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
