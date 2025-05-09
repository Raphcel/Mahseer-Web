document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.cardmuda, .carddua, .cardtiga');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
    });
  
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
        rect.bottom >= 0
      );
    }
  
    function handleScroll() {
      cards.forEach(card => {
        if (isInViewport(card)) {
          card.style.transition = 'opacity 0.9s ease-out, transform 0.9s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    }
  
    handleScroll();
  
    window.addEventListener('scroll', handleScroll);
  });