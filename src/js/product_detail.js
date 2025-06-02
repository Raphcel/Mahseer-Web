import supabase from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('No product ID provided');
        return;
    }

    // Fetch product details
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (error) {
        console.error('Error loading product:', error.message);
        return;
    }

    // Update page content with product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('priceDisplay').textContent = `Rp${parseInt(product.price).toLocaleString('id-ID')}`;
    document.getElementById('general-info').textContent = product.general_info || 'No general information available';
    document.getElementById('product-description').textContent = product.description || 'No description available';
    // Update stock
    const stockSpan = document.querySelector('.stock');
    if (stockSpan) {
        stockSpan.textContent = `Stock: ${product.stock ?? 'N/A'}`;
    }

    // Update main image
    const mainImage = document.getElementById('main-image');
    if (product.image_url) {
        mainImage.src = product.image_url;
        mainImage.alt = product.name;
    }

    // Fetch and set up thumbnails
    const { data: productImages } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId);

    const thumbnailContainer = document.getElementById('thumbnail-container');
    
    // Always add the main product image as first thumbnail
    if (product.image_url) {
        const mainThumb = document.createElement('img');
        mainThumb.src = product.image_url;
        mainThumb.alt = `${product.name} thumbnail`;
        mainThumb.className = 'thumbnail active';
        mainThumb.addEventListener('click', () => {
            mainImage.src = product.image_url;
            mainImage.alt = product.name;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            mainThumb.classList.add('active');
        });
        thumbnailContainer.appendChild(mainThumb);
    }

    // Add additional product images as thumbnails
    if (productImages) {
        productImages.forEach(img => {
            const thumb = document.createElement('img');
            thumb.src = img.image_url;
            thumb.alt = `${product.name} thumbnail`;
            thumb.className = 'thumbnail';
            thumb.addEventListener('click', () => {
                mainImage.src = img.image_url;
                mainImage.alt = product.name;
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbnailContainer.appendChild(thumb);
        });
    }    // Update the base price for currency conversion
    window.basePriceIDR = product.price;

    // Load related products (excluding current product)
    const { data: relatedProducts, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .neq('id', productId)
        .limit(3);

    if (!relatedError && relatedProducts) {
        const relatedContainer = document.getElementById('related-products');
        relatedProducts.forEach(relatedProduct => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${relatedProduct.image_url}" alt="${relatedProduct.name}" />
                <h3>${relatedProduct.name}</h3>
                <p>${relatedProduct.description ? relatedProduct.description.slice(0, 100) + '...' : ''}</p>
                <p class="card-price">Rp${parseInt(relatedProduct.price).toLocaleString('id-ID')}</p>
                <a href="product_detail.html?id=${relatedProduct.id}"><button class="see-more">See more</button></a>
            `;
            relatedContainer.appendChild(card);
        });
    }
});
