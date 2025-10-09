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
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', imageInput.files[0]);

      fetch('/add-art', {
        method: 'POST',
        body: formData
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
        } else {
      console.warn('Invalid input: some fields are empty');
    }
  });
}
