import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase initialization
const supabaseUrl = 'https://shrjipgvxhwadpdatdau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmppcGd2eGh3YWRwZGF0ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjY2NjEsImV4cCI6MjA2MTQwMjY2MX0.GbnDdaDzxorFZOns_K-71CRTcWNyC_G3I9crzpWIbRU'
const supabase = createClient(supabaseUrl, supabaseKey)

// Step control
const step1 = document.getElementById('step-1')
const step2 = document.getElementById('step-2')
const continueBtn = document.getElementById('continue-btn')
const backBtn = document.getElementById('back-btn')
const signupBtn = document.getElementById('signup-btn')
const googleBtn = document.querySelector('.google-btn')

continueBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const passwordWarning = document.getElementById('password-warning');

  if (!email) {
    alert('Please enter your email.');
    return;
  }

  if (password !== confirmPassword) {
    passwordWarning.style.display = 'block';
    alert('Passwords do not match. Please fix this before continuing.');
    return;
  } else {
    passwordWarning.style.display = 'none';
  }

  step1.style.display = 'none';
  step2.style.display = 'block';
})

backBtn.addEventListener('click', () => {
  step1.style.display = 'block'
  step2.style.display = 'none'
})

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
      data: { name } // Save name in metadata
    }
  })

  if (error) {
    alert('Signup error: ' + error.message)
  } else {
    alert('Signup successful! Please check your email to confirm.')
    window.location.href = 'login.html'
  }
})

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
