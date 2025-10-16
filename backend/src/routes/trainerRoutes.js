// src/routes/trainerRoutes.js - Routes cho huấn luyện viên
const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getMyTrainerProfile,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middlewares/auth');

// Tất cả routes cần authentication
router.use(protect);

// Route lấy thông tin trainer hiện tại
router.get('/me', getMyTrainerProfile);

// Public trainer routes
router.route('/')
  .get(getTrainers)
  .post(authorize('admin'), createTrainer);

router.route('/:id')
  .get(getTrainer)
  .put(updateTrainer) // Trainer có thể update chính mình, admin có thể update tất cả
  .delete(authorize('admin'), deleteTrainer);

module.exports = router;