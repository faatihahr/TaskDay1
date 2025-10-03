// Fungsi untuk tampilkan modal
export function showArtOverlay(art) {
  console.log('Opening modal for:', art.title);
  const modalTitle = document.getElementById('artModalTitle');
  const modalImage = document.getElementById('artModalImage');
  const modalDesc = document.getElementById('artModalDescription');

  modalTitle.textContent = art.title;
  modalImage.src = art.image;
  modalDesc.textContent = art.description;

  const modalEl = document.getElementById('artDetailModal');
  const exitBtn = document.getElementById('modalExitBtn');

  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  // Fokus otomatis ke Exit Button saat modal ditampilkan
  modalEl.addEventListener('shown.bs.modal', () => {
    exitBtn.focus();
  });

  // Focus Trap: hanya tombol exit yang bisa diakses dengan Tab
  modalEl.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();      // cegah pindah ke elemen lain
      exitBtn.focus();         // selalu fokus ke tombol exit
    }
    if (e.key === 'Escape') {
      modal.hide();            // tutup modal saat tekan Escape
    }
  });

  // Event klik tombol exit
  exitBtn.addEventListener('click', () => {
    modal.hide();
  });
}