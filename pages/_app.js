import "../styles/globals.css"
import { AuthProvider } from "../context/auth"
import { PlaylistProvider } from "../context/playlist"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <PlaylistProvider>
          <Component {...pageProps} />
        </PlaylistProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
