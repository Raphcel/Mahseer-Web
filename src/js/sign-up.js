import supabase from './supabase.js'

// Step control
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
if (!step1 || !step2) {
  console.error('❌ Error: Step containers not found in the DOM.');
}
const continueBtn = document.getElementById('continue-btn')
const backBtn = document.getElementById('back-btn')
const signupBtn = document.getElementById('signup-btn')
const googleBtn = document.querySelector('.google-btn')

// Step 1: Validate email and move to Step 2
continueBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;

  if (!email) {
    alert('Please enter your email.');
    return;
  }

  step1.style.display = 'none';
  step2.style.display = 'block';
})

// Step 2: Validate password and sign up
signupBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirm-password').value
  const passwordWarning = document.getElementById('password-warning')

  if (!name || !password || !confirmPassword) {
    alert('Please fill in all fields.')
    return
  }

  if (password !== confirmPassword) {
    passwordWarning.style.display = 'block'
    return
  } else {
    passwordWarning.style.display = 'none'
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name } // Still saves `name` into the user's metadata
    }
  })

  if (error) {
    alert('Signup error: ' + error.message)
    return
  }

  alert('Signup successful! Please check your email to verify your account.')
  setTimeout(() => {
    window.location.href = '../index.html'
  }, 2000)
})

// Back to Step 1
backBtn.addEventListener('click', () => {
  step1.style.display = 'block'
  step2.style.display = 'none'
})

// Google OAuth Signup
googleBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })

  if (error) {
    alert('Google sign-in failed: ' + error.message)
  } else {
    // user is redirected by Supabase
    console.log('Redirecting to Google login...')
  }
})