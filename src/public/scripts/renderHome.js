// rendering arts on the homepage
import { arts } from './storage.js';
import { renderCarousel } from './carousel.js';
import { showArtDetail } from './detail.js';

console.log('[render.js] Loaded');

const portfolio = document.getElementById('portfolio');

const createArtCard = (art, idx, onDelete) => {
  const card = document.createElement('div');
  card.className = 'art-card';
  card.innerHTML = `
      <img src="${art.image}" alt="${art.title}">
      <div class="art-info">
          <h3 class="art-title">${art.title}</h3>
          <p class="art-desc">${art.description}</p>
      </div>
      <button class="delete-art-btn" data-index="${idx}">Delete</button>
  `;

  card.addEventListener('click', e => {
    if (!e.target.classList.contains('delete-art-btn')) {
      showArtDetail(art);
    }
  });

  card.querySelector('.delete-art-btn').addEventListener('click', e => {
    e.stopPropagation();
    onDelete(idx);
  });

  return card;
};

export function renderArts() {
  console.log('renderArts() called');

  if (!portfolio) {
    console.warn('No portfolio container found');
    return;
  }

  portfolio.innerHTML = arts.length === 0
    ? '<p style="text-align:center;">No art uploaded yet.</p>'
    : '';

  arts.map((art, idx) =>
    portfolio.appendChild(
      createArtCard(art, idx, index => {
        console.log(`Deleting art at index ${index}`);
        arts.splice(index, 1);
        localStorage.setItem('arts', JSON.stringify(arts));
        renderArts();
        renderCarousel();
      })
    )
  );

  console.log('Arts rendered. Total:', arts.length);
}
