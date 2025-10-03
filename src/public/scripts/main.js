// js/main.js
import { enableArtDetail } from './renderHome.js';
import { setupAddArtForm } from './addArtForm.js';
// import { renderCarousel } from './carousel.js';

console.log('[main.js] Loaded');

document.addEventListener('DOMContentLoaded', () => {
  // Aktifkan fitur pada halaman home
  if (document.getElementById('portfolio')) {
    enableArtDetail();
  }

  // Aktifkan form hanya jika ada
  if (document.getElementById('add-art-form')) {
    setupAddArtForm();
  }

  // // Render carousel
  // if (document.getElementById('artCarousel')) {
  //   renderCarousel();
  // }

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
        window.location.href = "/profile";
      }, 500);
      console.log('Profile link clicked');
    });
  }
});
