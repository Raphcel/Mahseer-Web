import supabase from './supabase.js'

// Load Fun Facts
async function loadFunFacts() {
  const { data: funfacts, error } = await supabase
    .from('funfacts')
    .select('*');

  if (error) {
    console.error('Failed to load fun facts:', error);
    return;
  }

  const track = document.getElementById('carouselTrack');
  track.innerHTML = ''; // Clear existing slides

  funfacts.forEach(fact => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    // Limit content preview to ~150 chars, cut at word boundary
    let preview = fact.content || '';
    if (preview.length > 150) {
      let cut = preview.slice(0, 150);
      const lastSpace = cut.lastIndexOf(' ');
      preview = cut.slice(0, lastSpace > 0 ? lastSpace : 150) + '...';
    }
    slide.innerHTML = `
      <img src="${fact.image_url}" class="funfact-image">
      <div class="funfact-text">
        <h1>${fact.title}</h1>
        <h2>${fact.subtitle}</h2>
        <p>${preview}</p>
        <a href="src/pages/funfact.html" class="seeMore-button" id="seeMore-button-putih">See More</a>
      </div>
    `;
    track.appendChild(slide);
  });
}

// Load Products
async function loadProducts() {
  const container = document.getElementById('product-list');
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('❌ Error loading products:', error.message);
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'container-produk';

    card.innerHTML = `
      <div class="gambar-produk">
      <img src="${product.image_url}" alt="${product.name}" 
      style="width:100%; height:200px; object-fit:cover; border-radius:12px;">
      </div>
      <div class="detail-produk">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <h2>Rp${parseInt(product.price).toLocaleString('id-ID')}</h2>
      <a href="src/pages/product_detail.html?id=${product.id}" class="seeMore-button" id="seeMore-button-lime">See More</a>
      </div>
    `;

    container.appendChild(card);
  });
}

// Check and redirect admin after Google OAuth login (or any login)
async function checkAndRedirectAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userRow && userRow.role === 'admin') {
    window.location.href = '/src/pages/dashboard-depan.html';
  }
}

// Run on page load
checkAndRedirectAdmin();

// Call the functions to load data
loadFunFacts();
loadProducts();