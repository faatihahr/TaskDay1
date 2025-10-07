export function sendEditArt(id, title, description, image) {
  fetch('/edit-art', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, description, image })
  })
    .then(res => {
      if (res.ok) {
        if (window.location.pathname === '/home') {
          window.location.reload();
        } else {
          window.location.href = '/home';
        }
      } else {
        alert('Failed to update art');
      }
    });
}

export function enableArtDelete() {
  document.querySelectorAll('.delete-art-btn').forEach(deleteButton => {
    deleteButton.addEventListener('click', async e => {
      e.stopPropagation();
      const artId = deleteButton.dataset.id;

      if (confirm(`Are you sure you want to delete this art?`)) {
        try {
          const response = await fetch('/delete-art', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: artId })
          });

          if (response.ok) {
            deleteButton.closest('li').remove();
            document.querySelectorAll('.carousel-item').forEach(item => {
              if (item.dataset.artId === artId) {
                item.remove();
              }
            });
          } else {
            console.error(`Failed to delete art.`);
          }
        } catch (err) {
          console.error('Error deleting art:', err);
        }
      }
    });
  });
}