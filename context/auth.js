import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRouter,
} from "react"
import { getCookie } from "../lib/getCookie"
//import { supabase } from "../lib/supabase"

export const AuthContext = createContext({
  session: null,
  loading: false,
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log(document.cookie)
  useEffect(() => {
    const accessToken = getCookie("access_token", 2)
    console.log(accessToken)
    const user = getCookie("user")
    console.log(user)
    //  console.log("test auth")
    //  setLoading(true)
    //  setSession(supabase.auth.session())
    //  supabase.auth.onAuthStateChange((_event, session) => {
    //    setLoading(true)
    //    setSession(session)
    //    setLoading(false)
    //  })
    //  setLoading(false)
  }, [])
  return (
    <AuthContext.Provider value={{ session, loading }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
