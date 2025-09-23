// Navigation and Form Logic for Portfolio Website

// Get DOM elements
const homeLink = document.getElementById('home-link');
const projectsLink = document.getElementById('projects-link');
const portfolio = document.getElementById('portfolio');
const addArtSection = document.getElementById('add-art-section');
const addArtForm = document.getElementById('add-art-form');

// Load arts from localStorage or initialize empty array
let arts = JSON.parse(localStorage.getItem('arts')) || [];

// Render all art cards on the Home page
function renderArts() {
    portfolio.innerHTML = '';
    if (arts.length === 0) {
        portfolio.innerHTML = '<p style="text-align:center;">No art uploaded yet.</p>';
        return;
    }
    arts.forEach((art, idx) => {
        const card = document.createElement('div');
        card.className = 'art-card';
        card.innerHTML = `
            <img src="${art.image}" alt="${art.title}" style="max-width:100%;border-radius:10px;">
            <h3>${art.title}</h3>
            <p>${art.description}</p>
            <button class="delete-art-btn" data-index="${idx}">Delete</button>
        `;
        portfolio.appendChild(card);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-art-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            arts.splice(index, 1);
            localStorage.setItem('arts', JSON.stringify(arts));
            renderArts();
        });
    });
}

// Show Home (art cards), hide Add Art form
function showHome() {
    portfolio.style.display = 'block';
    addArtSection.style.display = 'none';
    homeLink.classList.add('active');
    projectsLink.classList.remove('active');
}

// Show Add Art form, hide Home (art cards)
function showProjects() {
    portfolio.style.display = 'none';
    addArtSection.style.display = 'block';
    homeLink.classList.remove('active');
    projectsLink.classList.add('active');
}

// Navigation event listeners
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showHome();
});

projectsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showProjects();
});

// Handle Add Art form submission
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
                image: event.target.result, // base64 image
                description 
            };
            arts.push(newArt);
            localStorage.setItem('arts', JSON.stringify(arts));
            addArtForm.reset();
            showHome();
            renderArts();
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
});

// Initial page load
renderArts();
showHome();