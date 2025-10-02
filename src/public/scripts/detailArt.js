// js/detail.js
console.log('[detail.js] Loaded');

export function showArtDetail(art) {
  console.log('showArtDetail() called with:', art);

  if (document.getElementById('art-detail-overlay')) {
    console.warn('Overlay already open, skipping');
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'art-detail-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.tabIndex = -1;

  overlay.innerHTML = `
    <div class="art-detail-modal rounded-4 shadow-lg p-4 bg-white bg-opacity-90" tabindex="0">
      <button class="close-detail-btn" aria-label="Close">&times;</button>
      <img src="${art.image}" alt="${art.title}" class="art-detail-img rounded-3 mb-4" style="max-width:100%;max-height:350px;object-fit:contain;">
      <h2 class="art-detail-title mb-3" style="color:#500b1f;">${art.title}</h2>
      <p class="art-detail-desc mb-2" style="color:#500b1f;font-size:1.2rem;">${art.description}</p>
    </div>
  `;

  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  });

  document.body.appendChild(overlay);
  console.log('Overlay added to DOM');

  const modal = overlay.querySelector('.art-detail-modal');
  const closeBtn = overlay.querySelector('.close-detail-btn');
  let lastFocused = document.activeElement;

  setTimeout(() => {
    modal.focus();
    console.log('Modal focused for accessibility');
  }, 10);

  function trapFocus(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
      console.log('Focus trapped on close button');
    }
    if (e.key === 'Escape') {
      overlay.remove();
      if (lastFocused) lastFocused.focus();
      console.log('Overlay closed by Escape key');
    }
  }

  modal.addEventListener('keydown', trapFocus);

  closeBtn.onclick = () => {
    overlay.remove();
    if (lastFocused) lastFocused.focus();
    console.log('Overlay closed by Close button');
  };

  overlay.onclick = e => { 
    if (e.target === overlay) {
      overlay.remove();
      if (lastFocused) lastFocused.focus();
      console.log('Overlay closed by background click');
    }
  };
}
