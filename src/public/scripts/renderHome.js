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
  });
}

  document.addEventListener('DOMContentLoaded', () => {
  enableArtDetail();
});
