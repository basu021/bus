const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bustrack1',
    password: 'Basu2001@@',
    port: 5444,
  });

module.exports = pool;
