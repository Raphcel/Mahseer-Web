// Initialize Supabase client
const client = supabase.createClient(
  'https://shrjipgvxhwadpdatdau.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmppcGd2eGh3YWRwZGF0ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjY2NjEsImV4cCI6MjA2MTQwMjY2MX0.GbnDdaDzxorFZOns_K-71CRTcWNyC_G3I9crzpWIbRU' // Replace with your actual public anon key
);

// Google Sign Up Button
export function setupGoogleSignup(buttonId) {
  const signupGoogleButton = document.getElementById(buttonId);
  if (signupGoogleButton) {
    signupGoogleButton.addEventListener('click', async () => {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.href
      });

      if (error) {
        alert('Google sign-up error: ' + error.message);
        return;
      }

      alert('Google Sign-Up successful!');
    });
  }
}

// Handle Sign Up with email/password
export function setupEmailSignup(formId) {
  const signupForm = document.getElementById(formId);
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      const { data, error } = await client.auth.signUp({
        email,
        password
      });

      if (error) {
        alert("Signup error: " + error.message);
        return;
      }

      alert("Signup successful! Please check your email to confirm your account.");
      e.target.reset();
    });
  }
}

// Handle Sign In with email/password
export function setupEmailLogin(formId) {
  const loginForm = document.getElementById(formId);
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      const { error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert("Login error: " + error.message);
        return;
      }

      alert("Login successful!");
      window.location.href = '/';
    });
  }
}

// Logout
export function setupLogout(buttonId) {
  const logoutButton = document.getElementById(buttonId);
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await client.auth.signOut();
      location.reload();
    });
  }
}

// Check if the current user is an admin
export async function isAdmin() {
  const user = (await client.auth.getUser()).data.user;
  const { data } = await client
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id);
  return data.length > 0;
}