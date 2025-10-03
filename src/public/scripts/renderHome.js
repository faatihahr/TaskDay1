// renderHome.js
import { showArtDetail } from './detailArt.js';

console.log('[renderHome.js] Loaded');

export function enableArtDetail() {
  // Cari semua card yang sudah dirender server di home.hbs
  const cards = document.querySelectorAll('.art-card');

  cards.forEach(card => {
    card.addEventListener('click', e => {
      const isDeleteBtn = e.target.classList.contains('delete-art-btn');
      if (!isDeleteBtn) {
        const art = {
          title: card.dataset.title,
          description: card.dataset.description,
          image: card.dataset.image
        };
        showArtDetail(art);
      }
    });
  });
  // Event listener for the Delete Button (New logic)
  const deleteButton = card.querySelector('.delete-art-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', async (e) => {
            e.stopPropagation(); // Mencegah klik tombol memicu showArtDetail
            const artTitle = deleteButton.dataset.artTitle;
            if (confirm(`Are you sure you want to delete the art titled "${artTitle}"?`)) {
                try {
                    const response = await fetch('/delete-art', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: artTitle })
                    });

                    if (response.ok) {
                        console.log(`Art titled "${artTitle}" deleted successfully.`);
                        card.remove(); // Hapus card dari tampilan
                    } else {
                        console.error(`Failed to delete art titled "${artTitle}".`);
                    }
                } catch (error) {
                    console.error('Error deleting art:', error);
                }
            }
        });
    }
  };
