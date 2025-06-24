document.addEventListener('DOMContentLoaded', function() {
  // Slideshow elementen
  const slideshow = document.querySelector('.slideshow');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const slideshowContainer = document.querySelector('.slideshow-container');
  
  // Variabelen voor slideshow
  let currentIndex = 2; // Start bij de 3e slide (index 2)
  const totalSlides = slides.length;
  let autoSlideInterval;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  
  // Initialiseer de slideshow
  initSlideshow();
  
  function initSlideshow() {
    // Ga direct naar de 3e slide bij het laden
    goToSlide(currentIndex, false);
    
    // Start automatische slideshow
    startAutoSlide();
    
    // Event listeners voor dots
    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-index'));
        goToSlide(slideIndex);
      });
    });
    
    // Touch events voor swipe functionaliteit
    slideshowContainer.addEventListener('touchstart', handleTouchStart, false);
    slideshowContainer.addEventListener('touchmove', handleTouchMove, false);
    slideshowContainer.addEventListener('touchend', handleTouchEnd, false);
    
    // Mouse events voor desktop swipe
    slideshowContainer.addEventListener('mousedown', handleMouseDown, false);
    slideshowContainer.addEventListener('mousemove', handleMouseMove, false);
    slideshowContainer.addEventListener('mouseup', handleMouseUp, false);
    slideshowContainer.addEventListener('mouseleave', handleMouseUp, false);
    
    // Pauzeer autoplay bij hover/touch
    slideshowContainer.addEventListener('mouseenter', pauseAutoSlide);
    slideshowContainer.addEventListener('mouseleave', startAutoSlide);
    slideshowContainer.addEventListener('touchstart', pauseAutoSlide);
    slideshowContainer.addEventListener('touchend', startAutoSlide);
  }
  
  // Ga naar specifieke slide
  function goToSlide(index, animate = true) {
    // Zorg dat index binnen bereik blijft
    if (index < 0) {
      index = totalSlides - 1;
    } else if (index >= totalSlides) {
      index = 0;
    }
    
    // Update huidige index
    currentIndex = index;
    
    // Verplaats slideshow met of zonder animatie
    if (animate) {
      slideshow.style.transition = 'transform 0.5s ease-in-out';
    } else {
      slideshow.style.transition = 'none';
    }
    
    slideshow.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Herstel transitie na directe verplaatsing
    if (!animate) {
      setTimeout(() => {
        slideshow.style.transition = 'transform 0.5s ease-in-out';
      }, 50);
    }
    
    // Update active dot
    updateDots();
  }
  
  // Update welke dot actief is
  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Start automatische slideshow
  function startAutoSlide() {
    // Clear bestaande interval als die er is
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    
    // Start nieuwe interval
    autoSlideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 2000); // Verander slide elke 2 seconden
  }
  
  // Pauzeer automatische slideshow
  function pauseAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }
  
  // Touch event handlers
  function handleTouchStart(e) {
    pauseAutoSlide();
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchMove(e) {
    if (!touchStartX) return;
    
    const touchX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchX;
    const offset = -currentIndex * 100 - (diff / slideshowContainer.offsetWidth * 100);
    
    // Beperk de verschuiving tijdens het slepen
    if (Math.abs(diff) < slideshowContainer.offsetWidth) {
      slideshow.style.transform = `translateX(${offset}%)`;
    }
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  }
  
  // Mouse event handlers (voor desktop swipe)
  function handleMouseDown(e) {
    e.preventDefault();
    pauseAutoSlide();
    isDragging = true;
    touchStartX = e.clientX;
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    
    const touchX = e.clientX;
    const diff = touchStartX - touchX;
    const offset = -currentIndex * 100 - (diff / slideshowContainer.offsetWidth * 100);
    
    // Beperk de verschuiving tijdens het slepen
    if (Math.abs(diff) < slideshowContainer.offsetWidth) {
      slideshow.style.transform = `translateX(${offset}%)`;
    }
  }
  
  function handleMouseUp(e) {
    if (!isDragging) return;
    
    isDragging = false;
    touchEndX = e.clientX;
    handleSwipe();
    startAutoSlide();
  }
  
  // Verwerk swipe beweging
  function handleSwipe() {
    const swipeThreshold = 50; // Minimale swipe afstand
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe naar links - volgende slide
        goToSlide(currentIndex + 1);
      } else {
        // Swipe naar rechts - vorige slide
        goToSlide(currentIndex - 1);
      }
    } else {
      // Niet ver genoeg geswiped, ga terug naar huidige slide
      goToSlide(currentIndex);
    }
    
    // Reset touch variabelen
    touchStartX = 0;
    touchEndX = 0;
  }
});