// js/main.js
import { enableArtDetail } from './renderHome.js';
import { setupAddArtForm } from './addArtForm.js';
import { sendEditArt, enableArtDelete } from './editArt.js';

console.log('[main.js] Loaded');
console.log('renderHome.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready, calling enableArtDetail from main.js');
  if (document.getElementById('portfolio')) {
    enableArtDetail();
    console.log('enableArtDetail() called');
  }

  // Aktifkan form hanya jika ada
  if (document.getElementById('add-art-form')) {
    setupAddArtForm();
  }

  // Edit Art Event Handler
  if (document.getElementById('edit-art-form')) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('edit-art-form').style.display = 'block';
        document.getElementById('old-title').value = btn.dataset.title; // optional, can remove if not needed
        document.getElementById('edit-art-title').value = btn.dataset.title;
        document.getElementById('edit-art-description').value = btn.dataset.description;
        document.getElementById('edit-art-form').dataset.id = btn.dataset.id;
      });
    });

    document.getElementById('edit-art-form').addEventListener('submit', e => {
      e.preventDefault();
      const id = e.target.dataset.id;
      const title = document.getElementById('edit-art-title').value;
      const description = document.getElementById('edit-art-description').value;
      const imageInput = document.getElementById('edit-art-image');
      if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = event => {
          sendEditArt(id, title, description, event.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        sendEditArt(id, title, description, null);
      }
    });
  }

  // Enable art deletion functionality
  if (document.getElementById('arts-list')) {
    enableArtDelete();
  }

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
