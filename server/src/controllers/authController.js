// authController.js
const bcrypt = require('bcryptjs');
const rolesModel = require('../models/rolesModel');
const usersModel = require('../models/usersModel');
const { use } = require('../routes/authRoutes');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bustrack1',
  password: 'Basu2001@@',
  port: 5444,
});

module.exports = {
  // login: async (req, res) => {
  //   const { login_id, password } = req.body;

  //   try {
  //     const user = await usersModel.getUserByLoginId(login_id);

  //     console.log('User:', user);

  //     if (!user || password !==  user.password) {
  //       console.log('Invalid credentials');
  //       return res.status(401).json({ message: 'Invalid credentials' });
  //     }

  //     const roleId = await rolesModel.getRoleIdByName('employee'); // Adjust based on your roles
  //     const userData = {
  //       id: user.id,
  //       email: user.email,
  //       role_id: roleId,
  //     };

  //     // You can generate a JWT here and send it as a response for further authentication.

  //     res.json({ message: 'Login successful', user: userData });
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // },
  login: async (req, res) => {
    const { login_id, password } = req.body;

    try {
      const user = await usersModel.getUserByLoginId(login_id);

      console.log('User:', user);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log('Invalid credentials');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const roleId = await rolesModel.getRoleIdByName('admin'); // Adjust based on your roles
      const userData = {
        id: user.user_id, // Update to match your user id column name
        email: user.email,
        role_id: roleId,
      };

      // You can generate a JWT here and send it as a response for further authentication.

      res.json({ message: 'Login successful', user: userData });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  signup: async (req, res) => {
    const { login_id, password } = req.body;

    try {
      const existingUser = await usersModel.getUserByLoginId(login_id);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const roleId = await rolesModel.getRoleIdByName('employee'); // Adjust based on your roles

      const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

      const newUser = {
        login_id: login_id,
        password: hashedPassword,
        // Add other user data as needed
        role_id: roleId,
      };

      const createdUser = await usersModel.createUser(newUser);

      // Handle the response or send confirmation here if needed

      res.status(201).json({ message: 'User created successfully', user: createdUser });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }, 
  checkidpass: async (login_id, password) => {
    try {
      const user = await usersModel.getUserByLoginId(login_id);

      if (!user) {
        return { status: 401, message: 'User not found' };
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return { status: 401, message: 'Invalid credentials' };
      }

      return { status: 200, message: 'Login successful' };
    } catch (error) {
      console.error('Error checking user and password:', error);
      return { status: 500, message: 'Internal server error' };
    }
  },


};
