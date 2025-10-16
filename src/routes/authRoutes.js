// src/routes/authRoutes.js - Routes cho authentication
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect); // Tất cả routes bên dưới đều cần authentication

router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;