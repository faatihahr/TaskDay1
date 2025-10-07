const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portofolio',
  password: 'postgres',
  port: 5432,
});

module.exports = pool;