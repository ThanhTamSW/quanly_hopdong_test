// src/routes/uploadRoutes.js - Routes upload file
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../config/multer');
const path = require('path');
const fs = require('fs');

// Tất cả routes cần authentication
router.use(protect);

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng chọn file để upload'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Upload file thành công',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/contracts/${req.file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// @desc    Xóa file
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/contracts', filename);

    // Kiểm tra file tồn tại
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy file'
      });
    }

    // Xóa file
    fs.unlinkSync(filePath);

    res.status(200).json({
      status: 'success',
      message: 'Xóa file thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;