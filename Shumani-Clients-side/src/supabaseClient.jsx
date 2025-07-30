// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ecojfuaigxbikadwnagh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb2pmdWFpZ3hiaWthZHduYWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTAyNzgsImV4cCI6MjA2ODc2NjI3OH0.Mr67mIDg9RGrkqWfFyRAEOdmoKDrsGzXwhon8WxyBN8";

export const supabase = createClient(supabaseUrl, supabaseKey);
