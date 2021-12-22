import "../styles/globals.css"
import { AuthProvider } from "../context/auth"
import { PlaylistProvider } from "../context/playlist"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { useEffect, useState } from "react"

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    console.log("dehydrated", pageProps.dehydratedState)
  }, [pageProps.dehydratedState])

  return (
    <AuthProvider>
      <PlaylistProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
          {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
      </PlaylistProvider>
    </AuthProvider>
  )
}

export default MyApp
