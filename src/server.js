// server.js  (Express Web Server)
const pool = require('./database/db');
const express = require('express');
const upload = require('./config/storage');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const { getArts, addArt, editArt, deleteArt, getAdmin, getRegist } = require('./dataHandler');
const bcrypt = require('bcrypt'); 
const session = require('express-session');

const app = express();
const PORT = 3000;

// Set view engine
app.set('view engine', 'hbs');
app.set("views", "./src/views");

//Middleware untuk logging request
app.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next(); 
});

//Cookie parser middleware
app.use(cookieParser());

// Middleware session
app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 jam
}));

// Middleware untuk parse body JSON (jika nanti menerima data POST)
app.use(express.json());

// Middleware untuk parse body form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Layani semua file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk cek admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.status(403).send('<h1>403 - Forbidden</h1>');
}

// Routing index
app.get('/', (req, res) => {
  res.render('index', { title: 'Digital Art Portfolio', activePage: 'index', isAdmin: req.cookies.isAdmin === 'true' });
});

//Admin register page
app.get('/register', (req, res) => {
  res.render('register', { title: 'Register - Digital Art Portfolio', activePage: 'register' });
});

async function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  try {
    const existingUser = await getAdmin(username);
    if (existingUser) {
      return res.status(400).render('register', { 
        title: 'Register - Digital Art Portfolio', 
        error: 'Username sudah ada. Silakan gunakan nama lain.',
        activePage: 'register' 
      });
    }
    next(); 
  } catch (err) {
    console.error('Error di middleware checkUsernameExists:', err);
    res.status(500).send('Internal Server Error');
  }
}

// Admin register POST 
app.post('/register', checkUsernameExists, async (req, res) => {
  console.log('POST /register -> data diterima:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.warn('Data tidak lengkap');
    return res.status(400).send('Data tidak lengkap');
  }

  try {
    await getRegist({ username, password });
    console.log('Registrasi berhasil untuk user:', username);
    const result = await pool.query('SELECT id, username, password_hash FROM admins ORDER BY id DESC');
    console.log('Data admin terkini di database:');
    result.rows.forEach((admins, index) => {
      console.log(`  ${index + 1}. ID: ${admins.id}, Username: ${admins.username}, Hash: ${admins.password_hash}`);
    });
    res.render('register', { 
      title: 'Register - Digital Art Portfolio', 
      success: 'Akun anda berhasil dibuat! Silahkan masuk kembali di halaman login',
      activePage: 'register'
    });
  } catch (err) {
    console.error('Error saat register:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Admin login page
app.get('/admin-login', (req, res) => {
  res.render('admin-login', { title: 'Login - Digital Art Portfolio', activePage: 'admin-login' });
});

async function verifyLogin(req, res, next) {
  const { username, password } = req.body;

  try {
    const admin = await getAdmin(username);

    if (!admin) {
      return res.render('admin-login', { 
        title: 'Login - Digital Art Portfolio', 
        error: 'Username tidak ditemukan',
        activePage: 'admin-login' 
      });
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.render('admin-login', { 
        title: 'Login - Digital Art Portfolio', 
        error: 'Password anda salah',
        activePage: 'admin-login'
      });
    }

    // Simpan session login
    req.session.isAdmin = true;
    req.session.username = username;
    next();

  } catch (err) {
    console.error('Error di middleware verifyLogin:', err);
    res.status(500).send('Internal Server Error');
  }
}

// Admin login POST (menggunakan database)
app.post('/admin-login', verifyLogin, (req, res) => {
  res.cookie('isAdmin', 'true', { httpOnly: true });
  res.redirect('/my-projects');
});

// Routing my-projects (hanya admin, data dari database)
app.get('/my-projects', requireAdmin, async (req, res) => {
  const arts = await getArts();
  res.render('my-projects', { title: 'My Projects', arts, activePage: 'my-projects', isAdmin: req.session.isAdmin });
});

// Route POST add-art (hanya admin, data ke database)
app.post('/add-art', requireAdmin, upload.single('image'),async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? '/upload/' + req.file.filename : null;
  if (!title || !image || !description) {
    return res.status(400).send('Invalid data');
  }
  await addArt({ title, description, image });
  console.log('✅ Art berhasil ditambahkan:', { title, description, image });
  res.status(200).send('OK');
});

// Route POST edit-art (hanya admin, data ke database)
app.post('/edit-art', requireAdmin, upload.single('image'), async (req, res) => {
  const { id, title, description } = req.body;
  const image = req.file ? '/upload/' + req.file.filename : null;
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
  console.log('✅ Data arts untuk home:', latestArts);
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
  req.session.destroy(err => {
    if (err) console.error('Error saat logout:', err);
    res.clearCookie('isAdmin');
    res.redirect('/');
  });
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
