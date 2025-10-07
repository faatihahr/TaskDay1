const pool = require('./database/db');

async function getArts() {
  const res = await pool.query('SELECT * FROM arts ORDER BY created_at DESC');
  return res.rows;
}

async function addArt({ title, description, image }) {
  await pool.query(
    'INSERT INTO arts (title, description, image) VALUES ($1, $2, $3)',
    [title, description, image]
  );
}

async function editArt({ id, title, description, image }) {
  await pool.query(
    'UPDATE arts SET title=$1, description=$2, image=$3, updated_at=NOW() WHERE id=$4',
    [title, description, image, id]
  );
}

async function deleteArt(id) {
  await pool.query('DELETE FROM arts WHERE id=$1', [id]);
}
async function getAdmin(username) {
  const res = await pool.query('SELECT * FROM admins WHERE username=$1', [username]);
  return res.rows[0];
}
module.exports = { getArts, addArt, editArt, deleteArt, getAdmin };