const express = require('express');
const router = express.Router();
const { registerUser, registerAdmin, login } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);
router.post('/login', login);

module.exports = router;