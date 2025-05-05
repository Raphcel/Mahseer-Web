import { supabase } from './auth.js';

// Fetch products and display them in the admin dashboard
export async function fetchProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const list = document.getElementById('product-list');
  if (list) {
    list.innerHTML = '';
    products.forEach(p => {
      list.innerHTML += `
        <div class="border p-4 rounded shadow">
          <img src="${p.image_url}" width="150"/>
          <p class="font-semibold">${p.name} - $${p.price}</p>
        </div>`;
    });
  }
}

// Handle product upload form submission
export function setupProductForm(formId) {
  const productForm = document.getElementById(formId);
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
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

      alert("Product uploaded successfully!");
      e.target.reset(); // Clear the form
      fetchProducts(); // Refresh the product list
    });
  }
}

// Initialize and fetch the current user
export async function initAdminDashboard() {
  const user = supabase.auth.user();
  if (!user) {
    window.location.href = '/login.html'; // Redirect to login if not authenticated
    return;
  }

  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    window.location.href = '/'; // Redirect to homepage if not an admin
    return;
  }

  document.getElementById('user-email').textContent = user.email;
  fetchProducts();
}