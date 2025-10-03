// public/scripts/addArtForm.js
console.log('[addArtForm.js] Loaded');

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
        // Kirim data ke server
        fetch('/add-art', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            image: event.target.result // base64 image
          })
        })
          .then(res => {
            if (res.ok) {
              console.log('Art added successfully');
              window.location.href = '/home'; // redirect ke home untuk melihat data baru
            } else {
              console.error('Failed to add art');
            }
          })
          .catch(err => console.error('Error:', err));
      };
      reader.readAsDataURL(imageInput.files[0]); // konversi gambar ke base64
    } else {
      console.warn('Invalid input: some fields are empty');
    }
  });
}
