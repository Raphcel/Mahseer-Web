import supabase from './supabase.js';

// Get form and input elements
const form = document.querySelector('.product-form');
const nameInput = form.querySelector('input[type="text"]');
const generalInfoInput = form.querySelectorAll('textarea')[0];
const descriptionInput = form.querySelectorAll('textarea')[1];
const priceInput = form.querySelector('input[placeholder="Enter price here..."]');
const stockInput = form.querySelector('input[placeholder="Enter stock here..."]');
const imageInput = form.querySelector('input[type="file"]');
const addButton = document.querySelector('.btn-add');

addButton.addEventListener('click', async (e) => {
  e.preventDefault();

  // Validate required fields
  if (!nameInput.value || !descriptionInput.value || !priceInput.value) {
    alert('Please fill in all required fields.');
    return;
  }

  let imageUrl = null;
  if (imageInput.files && imageInput.files[0]) {
    // Upload image to Supabase Storage (bucket: 'product-images')
    const file = imageInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);
    if (uploadError) {
      alert('Image upload failed: ' + uploadError.message);
      return;
    }
    imageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
  }

  // Insert product into Supabase
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: nameInput.value,
        description: descriptionInput.value,
        price: parseInt(priceInput.value),
        image_url: imageUrl,
        // You can add stock/generalInfo if your table supports it
      }
    ]);

  if (error) {
    alert('Failed to add product: ' + error.message);
    return;
  }

  alert('Product added successfully!');
  window.location.href = 'admin-products.html';
});
