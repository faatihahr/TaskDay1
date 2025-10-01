// Get DOM elements
const homeLink = document.getElementById('home-link');
const projectsLink = document.getElementById('projects-link');
const portfolio = document.getElementById('portfolio');
const addArtSection = document.getElementById('add-art-section');
const addArtForm = document.getElementById('add-art-form');
const carouselInner = document.getElementById('carousel-inner');

// Load arts from localStorage or initialize empty array, with error handling
let arts = [];
try {
  const storedArts = localStorage.getItem('arts');
  arts = storedArts ? JSON.parse(storedArts) : [];
  if (!Array.isArray(arts)) arts = [];
} catch (e) {
  console.error('Failed to parse arts from localStorage:', e);
  arts = [];
}
console.log('Loaded arts:', arts);

// Add default arts if arts is empty
if (arts.length === 0) {
  arts = [
    {
      title: "Sunset Landscape",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      description: "A beautiful sunset over the mountains."
    },
    {
      title: "Abstract Colors",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      description: "An abstract painting with vibrant colors."
    },
  ];
  localStorage.setItem('arts', JSON.stringify(arts));
  console.log('Default arts set:', arts);
}

// === Render carousel with up to 5 latest arts ===
function renderCarousel() {
  console.log('renderCarousel called');
  if (!carouselInner) return;

  carouselInner.innerHTML = '';
  const latestArts = arts.slice(-5).reverse();

  latestArts.forEach((art, idx) => {
    const item = document.createElement('div');
    item.className = 'carousel-item' + (idx === 0 ? ' active' : '');
    item.innerHTML = `
      <img src="${art.image}" class="d-block w-100" alt="${art.title}">
      <div class="carousel-caption d-none d-md-block">
          <h5>${art.title}</h5>
          <p>${art.description}</p>
      </div>
    `;
    carouselInner.appendChild(item);
  });

  console.log('Carousel rendered with arts:', latestArts);
}

// === Fungsi untuk menampilkan detail art ===
function showArtDetail(art) {
  console.log('showArtDetail called with:', art);
  if (document.getElementById('art-detail-overlay')) return;

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

  const modal = overlay.querySelector('.art-detail-modal');
  const closeBtn = overlay.querySelector('.close-detail-btn');
  let lastFocused = document.activeElement;
  setTimeout(() => modal.focus(), 10);

  function trapFocus(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn.focus();
    }
    if (e.key === 'Escape') {
      overlay.remove();
      if (lastFocused) lastFocused.focus();
      console.log('Art detail overlay closed with Escape');
    }
  }
  modal.addEventListener('keydown', trapFocus);

  closeBtn.onclick = () => {
    overlay.remove();
    if (lastFocused) lastFocused.focus();
    console.log('Art detail overlay closed');
  };

  overlay.onclick = e => { 
    if (e.target === overlay) {
      overlay.remove();
      if (lastFocused) lastFocused.focus();
      console.log('Art detail overlay closed by background click');
    }
  };
}

//  Versi baru renderArts dengan HOF, arrow function, dan callback
// New Function to create art card element 
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

  //  click card detail
  card.addEventListener('click', e => {
    if (!e.target.classList.contains('delete-art-btn')) showArtDetail(art);
  });

  //  delete button
  card.querySelector('.delete-art-btn').addEventListener('click', e => {
    e.stopPropagation();
    onDelete(idx);
  });

  return card;
};
//Function to render arts
const renderArts = () => {
  console.log('renderArts called');
  if (!portfolio) return;

  portfolio.innerHTML = arts.length === 0
    ? '<p style="text-align:center;">No art uploaded yet.</p>'
    : '';

  arts.map((art, idx) =>
    portfolio.appendChild(
      createArtCard(art, idx, index => {
        arts = arts.filter((_, i) => i !== index);  // hapus dengan filter
        localStorage.setItem('arts', JSON.stringify(arts));
        console.log('Art deleted at index:', index, 'Current arts:', arts);
        renderArts();
        renderCarousel();
      })
    )
  );

  console.log('Arts rendered:', arts);
};
// function renderArts() {
//     console.log('renderArts called');
//     if (!portfolio) return;
//     portfolio.innerHTML = '';
//     if (arts.length === 0) {
//         portfolio.innerHTML = '<p style="text-align:center;">No art uploaded yet.</p>';
//         console.log('No arts to render');
//         return;
//     }
//     arts.forEach((art, idx) => {
//         const card = document.createElement('div');
//         card.className = 'art-card';
//         card.innerHTML = `
//             <img src="${art.image}" alt="${art.title}">
//             <div class="art-info">
//                 <h3 class="art-title">${art.title}</h3>
//                 <p class="art-desc">${art.description}</p>
//             </div>
//             <button class="delete-art-btn" data-index="${idx}">Delete</button>
//         `;
//         // Event click untuk menampilkan detail
//         card.addEventListener('click', function(e) {
//             if (e.target.classList.contains('delete-art-btn')) return;
//             showArtDetail(art);
//         });
//         portfolio.appendChild(card);
//     });

//     // Event delegation for delete buttons
//     portfolio.addEventListener('click', function(e) {
//         if (e.target.classList.contains('delete-art-btn')) {
//             e.stopPropagation();
//             const index = Number(e.target.getAttribute('data-index'));
//             if (!isNaN(index)) {
//                 arts.splice(index, 1);
//                 localStorage.setItem('arts', JSON.stringify(arts));
//                 console.log('Art deleted at index:', index, 'Current arts:', arts);
//                 renderArts();
//                 renderCarousel();
//             }
//         }
//     }, { once: true });
    
//     console.log('Arts rendered:', arts);
// }

// === Handle Add Art form submission ===
if (addArtForm) {
  addArtForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('art-title').value.trim();
    const imageInput = document.getElementById('art-image');
    const description = document.getElementById('art-description').value.trim();

    console.log('Add Art form submitted:', { title, imageInput, description });

    if (title && imageInput.files[0] && description) {
      const reader = new FileReader();
      reader.onload = event => {
        const newArt = { 
          title, 
          image: event.target.result,
          description 
        };
        arts.push(newArt);
        localStorage.setItem('arts', JSON.stringify(arts));
        console.log('New art added:', newArt, 'Current arts:', arts);
        addArtForm.reset();
        window.location.href = "home.html"; // Redirect to home after add
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      console.log('Add Art form validation failed');
    }
  });
}

// === Initial page load logic ===
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOMContentLoaded event fired');

  // Home page
  if (portfolio && carouselInner) {
    renderArts();
    renderCarousel();
  }

  // Smooth scroll to footer on Contact navbar click
  const contactLink = document.getElementById("contact-link");
  const footer = document.getElementById("contact-footer");

  if (contactLink && footer) {
    contactLink.addEventListener("click", e => {
      e.preventDefault();
      footer.scrollIntoView({ behavior: "smooth" });
      console.log('Smooth scroll to footer triggered');
    });
  }

  // Profile page link
  const profileLink = document.getElementById("profile-link");
  if (profileLink) {
    profileLink.addEventListener("click", e => {
      document.body.style.transition = "opacity 0.5s";
      document.body.style.opacity = 0;
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
      e.preventDefault();
      console.log('Profile link clicked');
    });
  }
});