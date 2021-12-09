import styles from "../styles/Login.module.css"
import SpotifyIntro from "../components/SVG/SpotifyIntro"
import SpotifyIntroMobile from "../components/SVG/SpotifyIntroMobile"
import Loading from "../components/SVG/Loading"
import { useState } from "react"
import isEmail from "validator/lib/isEmail"
//adferra24@gmail.com
export default function index() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isEmail(email)) {
      setErrorMessage("please enter a valid email address")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("api/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.status === 200) {
        setSuccess(true)
      }

      //error is getting caught in the api return for some reason so
      //Manually throwing this duplicate email here
      const { code } = await res.json()
      if (code === "23505") {
        throw new Error("this email is already signed up", { cause: code })
      }
    } catch (error) {
      if (error.cause === "23505") setErrorMessage(error.message)
      else setErrorMessage("error, please try again")
    } finally {
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
      setIsLoading(false)
      setEmail("")
    }
  }
  return (
    <>
      <div className={styles.container}>
        <div>
          <SpotifyIntro name={styles.logo} />
          <SpotifyIntroMobile name={styles.logo__mobile} />
          <p className={styles.subheading}>
            it's like regular spotify, <br className={styles.break}></br> but
            worse.
          </p>
        </div>
        <div className={styles.content}>
          {success ? (
            <>
              {" "}
              <span className={styles.content__heading}> success! </span>{" "}
              <img src="/nathan.jpeg" className={styles.success__img} />
            </>
          ) : (
            <>
              <span className={styles.content__heading}>
                {" "}
                beta launching soon{" "}
              </span>
              <span className={styles.content__subheading}>
                {" "}
                or not... i don't know{" "}
              </span>
              <form
                className={styles.content__inputContainer}
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.content__input}
                  placeholder="sign up with your spotify email"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={styles.content__btn}
                  disabled={isLoading}
                >
                  {" "}
                  {isLoading ? (
                    <Loading height={35} width={35} fill={"#fff"} />
                  ) : (
                    "sign up"
                  )}{" "}
                </button>{" "}
              </form>
              {errorMessage.length ? (
                <span
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {errorMessage}{" "}
                </span>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
