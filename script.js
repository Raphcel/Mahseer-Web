document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase client
  const client = supabase.createClient(
    'https://shrjipgvxhwadpdatdau.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmppcGd2eGh3YWRwZGF0ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjY2NjEsImV4cCI6MjA2MTQwMjY2MX0.GbnDdaDzxorFZOns_K-71CRTcWNyC_G3I9crzpWIbRU' // Replace with your actual public anon key
  );

  // Google Sign Up Button
  const signupGoogleButton = document.getElementById('signup-google');
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

  // Toggle between forms (signup vs. login)
  const toggleFormLink = document.getElementById('toggle-form-link');
  if (toggleFormLink) {
    toggleFormLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior

      const signupForm = document.getElementById('signup-form');
      const loginForm = document.getElementById('login-form');

      if (signupForm && loginForm) {
        console.log('Before toggle:', {
          signupHidden: signupForm.classList.contains('hidden'),
          loginHidden: loginForm.classList.contains('hidden')
        });

        signupForm.classList.toggle('hidden');
        loginForm.classList.toggle('hidden');

        console.log('After toggle:', {
          signupHidden: signupForm.classList.contains('hidden'),
          loginHidden: loginForm.classList.contains('hidden')
        });

        toggleFormLink.textContent = signupForm.classList.contains('hidden')
          ? "Don’t have an account? Sign Up"
          : "Already have an account? Sign In";
      }
    });
  }

  // Handle Sign Up with email/password
  const signupForm = document.getElementById('signup-form');
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

  // Handle Sign In with email/password
  const loginForm = document.getElementById('login-form');
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

  // Google Login (for both signup and login)
  const googleButtons = document.querySelectorAll('.google-login');
  googleButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: window.location.href
      });

      if (error) {
        alert('Google login error: ' + error.message);
        return;
      }

      alert('Google Login successful!');
    });
  });

  // Logout
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await client.auth.signOut();
      location.reload();
    });
  }

  // Fetch and render products
  async function fetchProducts() {
    const { data: products, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    const list = document.getElementById('product-list');
    if (list) {
      list.innerHTML = '';
      products.forEach(p => {
        list.innerHTML += `
          <div>
            <img src="${p.image_url}" width="150"/>
            <p>${p.name} - $${p.price}</p>
          </div>`;
      });
    }
  }

  // Handle product form submit (admin only)
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = e.target.name.value;
      const price = e.target.price.value;
      const imageFile = e.target.image.files[0];

      if (!imageFile) return alert("Please select an image");

      const filePath = `${Date.now()}_${imageFile.name}`;
      const { data: imgData, error: imgError } = await client
        .storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (imgError) {
        console.error(imgError);
        return alert("Image upload failed.");
      }

      const { data: urlData } = await client
        .storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await client
        .from('products')
        .insert([{ name, price, image_url: urlData.publicUrl }]);

      if (insertError) {
        console.error(insertError);
        return alert("Failed to save product.");
      }

      e.target.reset();
      fetchProducts();
    });
  }

  // Check if the current user is an admin
  async function isAdmin() {
    const user = (await client.auth.getUser()).data.user;
    const { data } = await client
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id);
    return data.length > 0;
  }

  client.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = session.user;
  
      // Check if the user is an admin
      const { data: adminData, error } = await client
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id);
  
      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }
  
      if (adminData.length > 0) {
        // User is an admin, redirect to admin dashboard
        window.location.href = './admin-dashboard.html';
      } else {
        // User is not an admin, show user-specific content
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
          userInfo.classList.remove('hidden');
          document.getElementById('user-email').textContent = user.email;
        }
      }
    } else {
      // User is logged out, hide user-specific content
      const userInfo = document.getElementById('user-info');
      if (userInfo) {
        userInfo.classList.add('hidden');
      }
    }
  });

  // Handle successful login modal
  const loginSuccessModal = document.getElementById('login-success-modal');
  const closeModalButton = document.getElementById('close-modal');

  if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      loginSuccessModal.classList.add('hidden');
    });
  }

  // Show profile section after login
  const profileSection = document.getElementById('profile-section');
  const profileEmail = document.getElementById('profile-email');

  client.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // Show modal
      loginSuccessModal.classList.remove('hidden');

      // Display profile information
      profileSection.classList.remove('hidden');
      profileEmail.textContent = `Email: ${session.user.email}`;
    } else {
      profileSection.classList.add('hidden');
    }
  });

  // Initial load
  fetchProducts();

  const authButtonContainer = document.getElementById('auth-button-container');
  if (document.getElementById('auth-button-container')) {
    // Run the auth-button-container related code
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const authButtonContainer = document.getElementById('auth-button-container');
  
    if (authButtonContainer) {
      client.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session);
  
        if (session?.user) {
          console.log('User is logged in:', session.user);
  
          // User is logged in, show Logout button
          authButtonContainer.innerHTML = '<button id="logout-button" class="text-red-600 hover:underline">Logout</button>';
  
          const logoutButton = document.getElementById('logout-button');
          if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
              await client.auth.signOut();
              location.reload();
            });
          }
        } else {
          console.log('User is logged out');
  
          // User is logged out, show Sign In / Sign Up button
          authButtonContainer.innerHTML = '<a href="./login.html" id="auth-button" class="text-blue-600 hover:underline">Sign In / Sign Up</a>';
        }
      });
    } else {
      console.warn('auth-button-container not found in the DOM');
    }
  });

  // Prevent form submission from refreshing the page
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  });
});
