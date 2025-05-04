// Initialize Supabase client
const supabase = supabase.createClient(
  'https://shrjipgvxhwadpdatdau.supabase.co', 
  'your-public-anon-key' // Replace with your actual public anon key
);

// Toggle between forms (signup vs. login)
document.getElementById('toggle-form-link').addEventListener('click', () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const googleBtn = document.getElementById('login-google');

  // Toggle visibility based on current form
  if (signupForm.classList.contains('hidden')) {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    googleBtn.classList.add('hidden'); // Hide Google login on Sign Up form
    document.getElementById('toggle-form-link').textContent = "Already have an account? Sign In";
  } else {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    googleBtn.classList.remove('hidden'); // Show Google login on Login form
    document.getElementById('toggle-form-link').textContent = "Don’t have an account? Sign Up";
  }
});

// Handle Sign Up with email/password
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  // Sign up user with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Signup error: " + error.message);
    return;
  }

  alert("Signup successful! Please check your email to confirm your account.");
  e.target.reset(); // Clear form fields
});

// Handle Sign In with email/password
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  // Sign in user with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login error: " + error.message);
    return;
  }

  alert("Login successful!");
  window.location.href = '/'; // Redirect to homepage or dashboard
});

// Google Login for Sign Up (added directly to sign up form)
document.getElementById('signup-google').addEventListener('click', async () => {
  const { user, session, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    redirectTo: window.location.href
  });

  if (error) {
    alert('Google signup error: ' + error.message);
    return;
  }

  alert('Google Signup successful!');
  window.location.href = '/'; // Redirect to homepage or dashboard
});

// Google Login for Sign In (existing)
document.getElementById('login-google').addEventListener('click', async () => {
  const { user, session, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    redirectTo: window.location.href
  });

  if (error) {
    alert('Google login error: ' + error.message);
    return;
  }

  alert('Google Login successful!');
  window.location.href = '/'; // Redirect to homepage or dashboard
});

// Logout
document.getElementById('logout').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

// Fetch and render products
async function fetchProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    list.innerHTML += `
      <div>
        <img src="${p.image_url}" width="150"/>
        <p>${p.name} - $${p.price}</p>
      </div>`;
  });
}

// Handle product form submit (admin only)
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const price = e.target.price.value;
  const imageFile = e.target.image.files[0];

  if (!imageFile) return alert("Please select an image");

  const filePath = `${Date.now()}_${imageFile.name}`;
  const { data: imgData, error: imgError } = await supabase
    .storage
    .from('product-images')
    .upload(filePath, imageFile);

  if (imgError) {
    console.error(imgError);
    return alert("Image upload failed.");
  }

  const { data: urlData } = await supabase
    .storage
    .from('product-images')
    .getPublicUrl(filePath);

  const { error: insertError } = await supabase
    .from('products')
    .insert([{ name, price, image_url: urlData.publicUrl }]);

  if (insertError) {
    console.error(insertError);
    return alert("Failed to save product.");
  }

  e.target.reset();
  fetchProducts();
});

// Check if the current user is an admin (for product upload)
async function isAdmin() {
  const user = (await supabase.auth.getUser()).data.user;
  const { data } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id);
  return data.length > 0;
}

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    document.getElementById('login-google').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-email').textContent = session.user.email;
    if (await isAdmin()) {
      // Allow product upload for admin only
      document.getElementById('product-form').classList.remove('hidden');
    }
  } else {
    document.getElementById('login-google').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
  }
});

// Call fetchProducts when the page loads
fetchProducts();
