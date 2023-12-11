// authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for user login
router.post('/login', authController.login);

// Route for user signup
router.post('/signup', authController.signup);

// Route for check id pass
router.post('/idpass', authController.checkidpass);
module.exports = router;
