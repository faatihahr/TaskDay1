function closeModal() {
  const modal = document.getElementById('alertModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-active');
  }
}
window.closeModal = closeModal;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('alertModal');
  if (modal) {
    // Aktifkan blur
    document.body.classList.add('modal-active');
    // Tutup otomatis dalam 4 detik
    setTimeout(() => {
      if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-active');
      }
    }, 4000);
  }
});