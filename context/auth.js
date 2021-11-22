import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRouter,
} from "react"
//import { supabase } from "../lib/supabase"

export const AuthContext = createContext({
  session: null,
  loading: false,
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //console.log("test auth")
    //setLoading(true)
    //setSession(supabase.auth.session())
    //supabase.auth.onAuthStateChange((_event, session) => {
    //  setLoading(true)
    //  setSession(session)
    //  setLoading(false)
    //})
    //setLoading(false)
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
