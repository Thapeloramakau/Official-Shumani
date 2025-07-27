import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://orhtkbogskgvynaitmfp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaHRrYm9nc2tndnluYWl0bWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDM5NjAsImV4cCI6MjA2ODY3OTk2MH0.nDE9isR9i3ndkrO66EargxhQayJ94ceDnc7Hw1xPwwA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
