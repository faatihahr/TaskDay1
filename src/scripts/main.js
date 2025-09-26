// Get DOM elements
const homeLink = document.getElementById('home-link');
const projectsLink = document.getElementById('projects-link');
const portfolio = document.getElementById('portfolio');
const addArtSection = document.getElementById('add-art-section');
const addArtForm = document.getElementById('add-art-form');
const carouselInner = document.getElementById('carousel-inner');

// Load arts from localStorage or initialize empty array
let arts = JSON.parse(localStorage.getItem('arts')) || [];

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
}

// Render carousel with up to 5 latest arts
function renderCarousel() {
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
}

// Fungsi untuk menampilkan halaman detail art
function showArtDetail(art) {
    // Buat overlay detail
    const overlay = document.createElement('div');
    overlay.id = 'art-detail-overlay';
    overlay.innerHTML = `
        <div class="art-detail-modal rounded-4 shadow-lg p-4 bg-white bg-opacity-90">
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

    // Close button
    overlay.querySelector('.close-detail-btn').onclick = () => overlay.remove();
    // Close on overlay click (not modal)
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
}

// Render all art cards on the Home page
function renderArts() {
    if (!portfolio) return;
    portfolio.innerHTML = '';
    if (arts.length === 0) {
        portfolio.innerHTML = '<p style="text-align:center;">No art uploaded yet.</p>';
        return;
    }
    arts.forEach((art, idx) => {
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
        // Event click untuk menampilkan detail
        card.addEventListener('click', function(e) {
            // Hindari trigger saat klik tombol delete
            if (e.target.classList.contains('delete-art-btn')) return;
            showArtDetail(art);
        });
        portfolio.appendChild(card);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-art-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Hindari buka detail saat delete
            const index = this.getAttribute('data-index');
            arts.splice(index, 1);
            localStorage.setItem('arts', JSON.stringify(arts));
            renderArts();
            renderCarousel();
        });
    });
}

// Handle Add Art form submission (only on My Projects page)
if (addArtForm) {
    addArtForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('art-title').value.trim();
        const imageInput = document.getElementById('art-image');
        const description = document.getElementById('art-description').value.trim();

        if (title && imageInput.files[0] && description) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newArt = { 
                    title, 
                    image: event.target.result,
                    description 
                };
                arts.push(newArt);
                localStorage.setItem('arts', JSON.stringify(arts));
                addArtForm.reset();
                window.location.href = "home.html"; // Redirect to home after add
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    });
}

// Initial page load logic
document.addEventListener("DOMContentLoaded", function() {
    // Home page
    if (portfolio && carouselInner) {
        renderArts();
        renderCarousel();
    }
    
    // My Projects page
    if (addArtForm) {
        // nothing extra needed, handled above
    }

    // Smooth scroll to footer on Contact navbar click
    const contactLink = document.getElementById("contact-link");
    const footer = document.getElementById("contact-footer");

    if (contactLink && footer) {
        contactLink.addEventListener("click", function (e) {
            e.preventDefault();
            footer.scrollIntoView({ behavior: "smooth" });
        });
    }

    //Profile page 
    const profileLink = document.getElementById("profile-link");
    if (profileLink) {
        profileLink.addEventListener("click", function (e) {
            document.body.style.transition = "opacity 0.5s";
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 500);
            e.preventDefault();  
            window.location.href = "profile.html"; 
        });
    }

});