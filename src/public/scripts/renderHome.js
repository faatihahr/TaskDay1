import { showArtOverlay } from './detailArt.js';
export function enableArtDetail() {
  const cards = document.querySelectorAll('.art-card');

  cards.forEach(card => {
    // Klik card untuk buka modal
    card.addEventListener('click', e => {
      const isDeleteBtn = e.target.classList.contains('delete-art-btn');
      if (!isDeleteBtn) {
        const art = {
          title: card.dataset.title,
          description: card.dataset.description,
          image: card.dataset.image
        };
        showArtOverlay(art);
      }
    });

    // Tombol Delete
    const deleteButton = card.querySelector('.delete-art-btn');
    if (deleteButton) {
      deleteButton.addEventListener('click', async e => {
        e.stopPropagation();
        const artTitle = deleteButton.dataset.artTitle;

        if (confirm(`Are you sure you want to delete the art titled "${artTitle}"?`)) {
          try {
            const response = await fetch('/delete-art', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: artTitle })
            });

            if (response.ok) {
              console.log(`Art "${artTitle}" deleted successfully.`);
              card.closest('.col-12, .col-md-4').remove();

              // hapus juga di carousel
              document.querySelectorAll('.carousel-item').forEach(item => {
                if (item.dataset.artTitle === artTitle) {
                  item.remove();
                }
              });
            } else {
              console.error(`Failed to delete art "${artTitle}".`);
            }
          } catch (err) {
            console.error('Error deleting art:', err);
          }
        }
      });
    }
  });
}

  document.addEventListener('DOMContentLoaded', () => {
  enableArtDetail();
});
