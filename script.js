import supabase from './supabase/client.js';

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

// Handle product form submit
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

  const { data: urlData } = supabase
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

fetchProducts();

// Login with Google
document.getElementById('login-google').addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  });
  
  // Logout
  document.getElementById('logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    location.reload();
  });
  
  // Get current user
  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Logged in user:", user);
    return user;
  }

  const user = await getCurrentUser();
if (!user) {
  alert("Only admin can upload a product.");
  return;
}

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
    } else {
      document.getElementById('login-google').classList.remove('hidden');
      document.getElementById('user-info').classList.add('hidden');
    }
  });
  
  // SIGN UP with email/password
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const { data, error } = await supabase.auth.signUp({
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
  
  // SIGN IN with email/password
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      alert("Login error: " + error.message);
      return;
    }
  
    alert("Login successful!");
    e.target.reset();
    location.reload(); // or fetch products, show dashboard, etc.
  });

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
  
    if (error) {
      alert("Signup error: " + error.message);
      return;
    }
  
    const user = data.user;
  
    // Insert into 'profiles' with display_name
    await supabase.from('profiles').insert([
      {
        id: user.id,
        display_name: email  // You can later add a real display name field
      }
    ]);
  
    alert("Signup successful! Check your email to confirm.");
    e.target.reset();
  });
  
  // Connect to your Supabase project
  const supabase = supabase.createClient(
    'https://shrjipgvxhwadpdatdau.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmppcGd2eGh3YWRwZGF0ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjY2NjEsImV4cCI6MjA2MTQwMjY2MX0.GbnDdaDzxorFZOns_K-71CRTcWNyC_G3I9crzpWIbRU'
  );
  
  // Toggle between forms (signup vs. login)
  document.getElementById('toggle-form-link').addEventListener('click', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const googleBtn = document.getElementById('login-google');
  
    if (signupForm.classList.contains('hidden')) {
      signupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      googleBtn.classList.add('hidden');
      document.getElementById('toggle-form-link').textContent = 'Already have an account? Sign In';
    } else {
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      googleBtn.classList.remove('hidden');
      document.getElementById('toggle-form-link').textContent = 'Don’t have an account? Sign Up';
    }
  });
  
  // SIGN UP with email/password
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const { data, error } = await supabase.auth.signUp({
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
  
  // SIGN IN with email/password
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      alert("Login error: " + error.message);
      return;
    }
  
    alert("Login successful!");
    window.location.href = '/'; // redirect to homepage or dashboard
  });
  
  // Google Login
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
    window.location.href = '/'; // redirect to homepage or dashboard
  });
  