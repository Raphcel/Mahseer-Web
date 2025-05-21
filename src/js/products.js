import supabase from './supabase.js'

// Get container where products will be injected
const container = document.getElementById('product-list')
if (!container) {
  console.error('❌ Error: #product-list container not found in the DOM.');
}

async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*')

  if (error) {
    console.error('❌ Error loading products:', error.message)
    return
  }

  products.forEach(product => {
    const card = document.createElement('div')
    card.className = 'container-produk'

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
  `

    container.appendChild(card)
  })
}

loadProducts()
