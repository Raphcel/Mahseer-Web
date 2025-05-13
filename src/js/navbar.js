import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shrjipgvxhwadpdatdau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmppcGd2eGh3YWRwZGF0ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjY2NjEsImV4cCI6MjA2MTQwMjY2MX0.GbnDdaDzxorFZOns_K-71CRTcWNyC_G3I9crzpWIbRU';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized:', supabase);

async function updateNavbar(session) {
    const loginButton = document.querySelector('.login-button');
    console.log('Updating navbar with session:', session);

    if (session) {
        console.log('User is logged in:', session.user);
        loginButton.textContent = 'Logout';
        loginButton.href = '#';
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.reload();
        });
    } else {
        console.log('User is not logged in');
        loginButton.textContent = 'Login / Sign Up';
        loginButton.href = 'src/pages/login.html';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');
    const { data: session, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error fetching session:', error);
    } else {
        console.log('Session data on page load:', session);
    }
    updateNavbar(session);

    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        updateNavbar(session);
    });
});