import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ndmktbnheyldtorawwtk.supabase.co'
const supabaseAnonKey = 'sb_publishable_k5GyLKWHD9HMMiNeekO6bg_YuWESS2b'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
