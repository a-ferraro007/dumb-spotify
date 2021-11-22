import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  typeof window === undefined
    ? process.env.SUPABASE_CLIENT_URL
    : "https://wbzfziynvdatatvnzjnm.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
// typeof window === undefined
//  ?
//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjY5MTkxNSwiZXhwIjoxOTUyMjY3OTE1fQ.lzcbE7KtWEU0lOQKrR9z0V9HWnZrwDnLTiAy_A--oR8"
export const supabase = createClient(supabaseUrl, supabaseKey)
