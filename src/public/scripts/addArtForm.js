// handling the Add Art form submission
import { arts } from './storage.js';

console.log('[form.js] Loaded');

export function setupAddArtForm() {
  console.log('setupAddArtForm() initialized');

  const addArtForm = document.getElementById('add-art-form');
  if (!addArtForm) {
    console.warn('Add Art form not found on this page');
    return;
  }

  addArtForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('Add Art form submitted');

    const title = document.getElementById('art-title').value.trim();
    const imageInput = document.getElementById('art-image');
    const description = document.getElementById('art-description').value.trim();

    if (title && imageInput.files[0] && description) {
      const reader = new FileReader();
      reader.onload = event => {
        const newArt = { title, image: event.target.result, description };
        arts.push(newArt);
        localStorage.setItem('arts', JSON.stringify(arts));
        console.log('New art added:', newArt);
        addArtForm.reset();
        window.location.href = "home.html";
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      console.warn('Invalid input: some fields are empty');
    }
  });
}
