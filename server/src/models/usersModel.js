// usersModel.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bustrack1',
  password: 'Basu2001@@',
  port: 5444,
});

// module.exports = {
//   getUserByEmail: async (email) => {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     return result.rows.length > 0 ? result.rows[0] : null;
//   },
// getUserByLoginId: async (loginId) => {
//     const result = await pool.query('SELECT * FROM login WHERE login_id = $1', [loginId]);
//     return result.rows.length > 0 ? result.rows[0] : null;
//   },
//   createUser: async (user) => {
//     const { login_id, password, role_id } = user;
//     const result = await pool.query(
//       'INSERT INTO users (login_id, password, role_id) VALUES ($1, $2, $3) RETURNING *',
//       [login_id, password, role_id]
//     );
//     return result.rows[0];
//   },
// };

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error in getUserByEmail:", error.message);
      throw error;
    }
  },
  getUserByLoginId: async (login_id) => {
    try {
      const result = await pool.query('SELECT login_id, user_id, password_hash FROM login WHERE login_id = $1', [login_id]);
      console.log(result.rows);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by login ID:', error.message);
      throw new Error('Internal server error');
    }
  },
  createUser: async (user) => {
    try {
      const { login_id, password, role_id } = user;
      const result = await pool.query(
        'INSERT INTO users (login_id, password, role_id) VALUES ($1, $2, $3) RETURNING *',
        [login_id, password, role_id]
      );
      return result.rows[0];
    } catch (error) {
      // Handle or log the error here
      console.error("Error in createUser:", error.message);
      throw error;
    }
  },
  checkIdPass: async (login_id, password) => {
    try {
      const result = await pool.query('SELECT * FROM login WHERE login_id = $1', [login_id]);

      if (result.rows.length === 0) {
        return null; // Return null for non-existent users
      }

      const hashedPassword = result.rows[0].password_hash;

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      return passwordMatch; // Returns true if password matches, false otherwise

    } catch (error) {
      console.error('Error checking user and password:', error);
      throw new Error('Internal server error');
    }
  },
};



