// dataHandler.js
const fs = require('fs');
const path = require('path');

// TENTUKAN LOKASI FILE DATA: artsData.json akan berada di direktori yang sama dengan dataHandler.js
const DATA_FILE = path.join(__dirname, 'artsData.json');
let arts = []; // Array yang akan menyimpan data art


//  Memuat data art dari file JSON lokal saat server dimulai.
function loadArts() {
  try {
    // Membaca konten file secara synchronous (agar data siap sebelum Express mulai routing)
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    arts = JSON.parse(data);
    console.log(`[Persistence] Loaded ${arts.length} arts from file: ${DATA_FILE}`);
  } catch (err) {
    // Jika file tidak ada (pertama kali dijalankan), atau ada error baca/parse
    if (err.code === 'ENOENT') {
      console.log('[Persistence] Art data file not found. Starting with empty array.');
      arts = [];
    } else {
      console.error('[Persistence] Error loading arts data:', err);
    }
  }
}


// Menyimpan data array 'arts' ke file JSON lokal setelah ada perubahan.
function saveArts() {
  try {
    // Menulis array 'arts' ke file secara synchronous
    fs.writeFileSync(DATA_FILE, JSON.stringify(arts, null, 2), 'utf8');
    console.log('[Persistence] Art data saved successfully.');
  } catch (err) {
    console.error('[Persistence] Error saving arts data:', err);
  }
}

// Panggil fungsi loadArts() saat modul ini dimuat pertama kali oleh server.js
loadArts();

// Export array 'arts' dan fungsi 'saveArts' agar bisa diakses oleh server.js
module.exports = {
  arts,
  saveArts
};