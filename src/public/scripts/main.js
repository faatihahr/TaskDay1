// js/main.js
import { renderArts } from './render.js';
import { renderCarousel } from './carousel.js';
import { setupAddArtForm } from './form.js';

console.log('[main.js] Loaded');

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById('portfolio') && document.getElementById('carousel-inner')) {
    renderArts();
    renderCarousel();
  }

  setupAddArtForm();

  const contactLink = document.getElementById("contact-link");
  const footer = document.getElementById("contact-footer");

  if (contactLink && footer) {
    contactLink.addEventListener("click", e => {
      e.preventDefault();
      footer.scrollIntoView({ behavior: "smooth" });
    });
  }

  const profileLink = document.getElementById("profile-link");
  if (profileLink) {
    profileLink.addEventListener("click", e => {
      e.preventDefault();
      document.body.style.transition = "opacity 0.5s";
      document.body.style.opacity = 0;
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
      console.log('Profile link clicked');
    });
  }
});
