// server.js  (Express Web Server)
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

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

// Routing untuk setiap halaman
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'my-projects.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
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

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
