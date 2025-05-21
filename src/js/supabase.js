// Import the Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
// Initialize the Supabase client
const supabaseUrl = 'https://shrjipgvxhwadpdatdau.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmppcGd2eGh3YWRwZGF0ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjY2NjEsImV4cCI6MjA2MTQwMjY2MX0.GbnDdaDzxorFZOns_K-71CRTcWNyC_G3I9crzpWIbRU'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: sessionStorage
    }
});

export default supabase;