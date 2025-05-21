import supabase from './supabase.js'

// Updates the navbar button based on user role
async function updateNavbar() {
    const loginButton = document.querySelector('.login-button');
    if (!loginButton) {
        console.error('No .login-button found in the DOM!');
        return;
    }
    // Get current session
    const sessionRes = await supabase.auth.getSession();
    const session = sessionRes.data?.session;
    if (session && session.user) {
        // Fetch user role from users table
        const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
        if (userData && typeof userData.role === 'string' && userData.role.length > 0) {
            loginButton.style.display = 'none';
            // Show a dedicated logout button if present
            let logoutButton = document.querySelector('.logout-button');
            if (!logoutButton) {
                // If not present, create and insert it after loginButton
                logoutButton = document.createElement('a');
                logoutButton.className = 'logout-button';
                logoutButton.href = '#';
                logoutButton.textContent = 'Logout';
                loginButton.parentNode.insertBefore(logoutButton, loginButton.nextSibling);
            }
            logoutButton.style.display = '';
            logoutButton.onclick = async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.reload();
            };
            return;
        } else {
            // Hide logout button if present
            const logoutButton = document.querySelector('.logout-button');
            if (logoutButton) logoutButton.style.display = 'none';
            loginButton.style.display = '';
        }
    }
    // If not logged in or no role found
    loginButton.textContent = 'Login / Sign Up';
    loginButton.href = 'src/pages/login.html';
    loginButton.onclick = null;
}

window.initNavbar = updateNavbar;