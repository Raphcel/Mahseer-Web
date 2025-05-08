let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("content");
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    plusSlides(-1);
    event.preventDefault(); 
  } else if (event.key === 'ArrowRight') {
    plusSlides(1);
    event.preventDefault(); 
  }
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
  touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(event) {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    plusSlides(1);
  }
  if (touchEndX > touchStartX + 50) {
    plusSlides(-1);
  }
}