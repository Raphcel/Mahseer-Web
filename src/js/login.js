import supabase from './supabase.js'

// Elements
const loginForm = document.getElementById('signup-form')
const googleLoginBtn = document.getElementById('signup-google')
const loginSuccessModal = document.getElementById('login-success-modal')
const closeModalBtn = document.getElementById('close-modal')
const profileSection = document.getElementById('profile-section')
const profileEmail = document.getElementById('profile-email')

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = loginForm.elements['email'].value
  const password = loginForm.elements['password'].value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    alert('Login failed: ' + error.message)
    return
  }

  // Show modal and profile section
  loginSuccessModal.classList.remove('hidden')
  profileSection.classList.remove('hidden')
  profileEmail.textContent = `Logged in as: ${data.user.email}`

  // Optionally redirect to homepage after delay
  setTimeout(() => {
    window.location.href = '/index.html'
  }, 2000)
})

// Google OAuth Login
googleLoginBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/index.html`  // or correct path to your homepage
    }
  })

  if (error) {
    alert('Google sign-in failed: ' + error.message)
  }
})

