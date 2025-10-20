// src/routes/trainerRoutes.js - Trainer routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');

// All routes need authentication
router.use(protect);

// Basic CRUD routes
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Trainer routes - GET /api/trainers'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    status: 'success',
    message: `Get trainer ${req.params.id}`
  });
});

router.post('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Create trainer'
  });
});

router.put('/:id', (req, res) => {
  res.json({
    status: 'success',
    message: `Update trainer ${req.params.id}`
  });
});

router.delete('/:id', (req, res) => {
  res.json({
    status: 'success',
    message: `Delete trainer ${req.params.id}`
  });
});

module.exports = router;