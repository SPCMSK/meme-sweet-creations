import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zrwuraveabncvruzpapa.supabase.co' // Reemplaza con tu URL de Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd3VyYXZlYWJuY3ZydXpwYXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNTY2NTAsImV4cCI6MjA2MzYzMjY1MH0._1k3LlBVR1n7-RIWkMjtAnBH6oynKEjV6b4ASXKyOB8' // Reemplaza con tu anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
