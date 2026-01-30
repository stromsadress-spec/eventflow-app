import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://erhstriierzmlluafvor.supabase.co'
const supabaseAnonKey = 'sb_publishable_SKj4RHE2Nw9Q8Zmaj4HVaw_5Zq1tnfs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
