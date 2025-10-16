// src/models/Trainer.js - Model huấn luyện viên
const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateNumber: String
  }],
  hourlyRate: {
    type: Number,
    default: 0,
    min: 0
  },
  experience: {
    type: Number, // Số năm kinh nghiệm
    default: 0
  },
  bio: {
    type: String,
    trim: true
  },
  languages: [{
    type: String,
    trim: true
  }],
  workingHours: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: true } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } }
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
trainerSchema.index({ code: 1 });
trainerSchema.index({ user: 1 });
trainerSchema.index({ status: 1 });
trainerSchema.index({ 'specialties': 1 });

// Virtual: Tổng số buổi dạy
trainerSchema.virtual('totalSessions', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'trainer',
  count: true
});

// Method: Generate trainer code
trainerSchema.statics.generateCode = async function() {
  const count = await this.countDocuments();
  return `TR${String(count + 1).padStart(4, '0')}`;
};

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;