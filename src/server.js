// server.js  (Express Web Server)
const pool = require('./database/db');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const { getArts, addArt, editArt, deleteArt, getAdmin } = require('./dataHandler');
const bcrypt = require('bcrypt'); // Untuk password hash

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
//Cookie parser middleware
app.use(cookieParser());

// Middleware untuk parse body JSON (jika nanti menerima data POST)
app.use(express.json());

// Middleware untuk parse body form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Layani semua file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk cek admin
function requireAdmin(req, res, next) {
  if (req.cookies && req.cookies.isAdmin === 'true') return next();
  res.status(403).send('<h1>403 - Forbidden</h1>');
}

// Routing index
app.get('/', (req, res) => {
  res.render('index', { title: 'Digital Art Portfolio', activePage: 'index', isAdmin: req.cookies.isAdmin === 'true' });
});

// Admin login page
app.get('/admin-login', (req, res) => {
  res.render('admin-login', { title: 'Admin Login', activePage: 'admin-login' });
});

// Admin login POST (menggunakan database)
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await getAdmin(username);
  if (admin && await bcrypt.compare(password, admin.password_hash)) {
    res.cookie('isAdmin', 'true', { httpOnly: true });
    return res.redirect('/my-projects');
  }
  res.render('admin-login', { title: 'Admin Login', error: 'Invalid credentials' });
});

// Routing my-projects (hanya admin, data dari database)
app.get('/my-projects', requireAdmin, async (req, res) => {
  const arts = await getArts();
  res.render('my-projects', { title: 'My Projects', arts, activePage: 'my-projects', isAdmin: req.cookies.isAdmin === 'true' });
});

// Route POST add-art (hanya admin, data ke database)
app.post('/add-art', requireAdmin, async (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !image || !description) {
    return res.status(400).send('Invalid data');
  }
  await addArt({ title, description, image });
  res.status(200).send('OK');
});

// Route POST edit-art (hanya admin, data ke database)
app.post('/edit-art', requireAdmin, async (req, res) => {
  const { id, title, description, image } = req.body;
  await editArt({ id, title, description, image });
  res.status(200).send('OK');
});

// Route DELETE delete-art (hanya admin, data ke database)
app.delete('/delete-art', requireAdmin, async (req, res) => {
  const { id } = req.body;
  await deleteArt(id);
  res.status(200).send('OK');
});

// Routing home (art dan carousel)
app.get('/home', async (req, res) => {
  const arts = await getArts();
  const latestArts = arts.slice(0, 5);
  res.render('home', { title: 'Home - Digital Art Portfolio', activePage: 'home', arts, carouselArts: latestArts, isAdmin: req.cookies.isAdmin === 'true' });
});

// Route profile
app.get('/profile', (req, res) => {
  res.render('profile', { title: 'About Me - Digital Art Portfolio', activePage: 'profile', isAdmin: req.cookies.isAdmin === 'true' });
});

// Route contact
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact - Digital Art Portfolio', activePage: 'contact', isAdmin: req.cookies.isAdmin === 'true' });
});

// Route logout
app.get('/logout', (req, res) => {
  res.clearCookie('isAdmin');
  res.redirect('/');
});

// 404 dan 500 error handler
app.use((req, res, next) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});
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
  // Tes koneksi database
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
    } else {
      console.log('✅ Database connected! Current time:', result.rows[0].now);
    }
  });
});
