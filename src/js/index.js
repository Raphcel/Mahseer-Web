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
    slide.innerHTML = `
      <img src="${fact.image_url}" class="funfact-image">
      <div class="funfact-text">
        <h1>${fact.title}</h1>
        <h2>${fact.subtitle}</h2>
        <p>${fact.content}</p>
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
        <a href="#shop" class="seeMore-button" id="seeMore-button-lime">See More</a>
      </div>
    `;

    container.appendChild(card);
  });
}

// Call the functions to load data
loadFunFacts();
loadProducts();