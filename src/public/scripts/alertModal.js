document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('alertModal');
  if (modal) {
    document.body.classList.add('modal-active'); 
  }
});
  function closeModal() {
    const modal = document.getElementById('alertModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-active');
    }
  }
  setTimeout(closeModal, 3000);