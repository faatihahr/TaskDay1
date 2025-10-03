// server.js  (Express Web Server)
const express = require('express');
const path = require('path');
const hbs = require('hbs');

const { arts, saveArts} = require('./dataHandler');

const app = express();
const PORT = 3000;

// Set view engine
app.set('view engine', 'hbs');
app.set("views", "./src/views");

//Middleware untuk logging request
app.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next(); // Lanjut ke middleware/route berikutnya
});

// Middleware untuk parse body JSON (jika nanti menerima data POST)
app.use(express.json());

// Middleware untuk parse body form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Layani semua file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Routing index
app.get('/', (req, res) => {
  res.render('index', { title: 'Digital Art Portfolio', activePage: 'index' });
});

// Routing home (art dan carousel)
app.get('/home', (req, res) => {
  const latestArts = arts.slice(0, 5); // Ambil 5 karya terbaru
  console.log('Rendering /home with carouselArts:', latestArts);
  res.render('home', { title: 'Home - Digital Art Portfolio', activePage: 'home', arts, carouselArts: latestArts });
});
//Route POST delete-art//
app.delete('/delete-art', express.json(), (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send('Invalid data');
  }
  const indexToDelete = arts.findIndex(art => art.title === title);
  if (indexToDelete === -1) {
    return res.status(404).send('Art not found');
  }
  arts.splice(indexToDelete, 1);
  saveArts();
  res.status(200).send('OK');
});

// Routing my-projects
app.get('/my-projects', (req, res) => {
  res.render('my-projects', { title: 'My Projects - Digital Art Portfolio', activePage: 'my-projects' });
});
// Route POST add-art//
app.post('/add-art', express.json(), (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !image || !description) {
    return res.status(400).send('Invalid data');
  }
  // Simpan di awal array agar yang terbaru di posisi pertama//
  arts.unshift({ title, description, image });
  saveArts(); // Simpan perubahan ke file JSON
  console.log('New art added:', title);
  res.status(200).send('OK');
});

// Route profile
app.get('/profile', (req, res) => {
  res.render('profile', { title: 'About Me - Digital Art Portfolio', activePage: 'profile' });
});

// Route contact
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact - Digital Art Portfolio', activePage: 'contact' });
});

//Middleware penanganan error//
// Jika route tidak ditemukan (404)
app.use((req, res, next) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// Jika terjadi error di server (500)
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).send('<h1>500 - Internal Server Error</h1>');
});

hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
