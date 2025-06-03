import supabase from './supabase.js';

// Fetch funfacts from database and render dynamically
async function loadFunFacts() {
  const { data: funfacts, error } = await supabase
    .from('funfacts')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Failed to load funfacts:', error);
    return;
  }

  const slideshowContainer = document.querySelector('.slideshow-container');
  if (!slideshowContainer) return;

  // Remove all .content elements
  document.querySelectorAll('.slideshow-container .content').forEach(el => el.remove());

  // Remove all .dot elements
  document.querySelectorAll('.dot').forEach(el => el.remove());

  // Insert funfacts
  funfacts.forEach((fact, idx) => {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.innerHTML = `
      <h1><span class="birudongker">${fact.title || ''}</span></h1>
      <h2><span class="birunila">${fact.subtitle || ''}</span></h2>
      <div class="funfact-content">
        <img src="${fact.image_url || '../assets/images/funfact.png'}" alt="Funfact Image" class="funfact-image">
        <div class="funfact-text">
          <p>${fact.content || ''}
            ${fact.sumber ? `<br><br><strong>Sumber:</strong><br>${fact.sumber}` : ''}
          </p>
        </div>
      </div>
    `;
    // Insert before navigation arrows
    const prevArrow = document.querySelector('.prev');
    slideshowContainer.insertBefore(contentDiv, prevArrow);
  });

  // Insert dots
  const dotContainer = document.querySelector('div[style*="text-align:center"]');
  if (dotContainer) {
    funfacts.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.onclick = () => currentSlide(idx + 1);
      dotContainer.appendChild(dot);
    });
  }

  // Show first slide
  if (typeof showSlides === 'function') showSlides(1);
}

// Run on page load
window.addEventListener('DOMContentLoaded', loadFunFacts);
