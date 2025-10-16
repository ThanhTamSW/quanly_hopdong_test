// src/controllers/scheduleController.js - Xử lý lịch dạy
const Schedule = require('../models/Schedule');
const Trainer = require('../models/Trainer');

// @desc      Lấy danh sách lịch dạy
// @route     GET /api/schedules
// @access    Private
exports.getSchedules = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      trainer,
      date,
      startDate,
      endDate,
      status,
      sortBy = 'date',
      order = 'asc'
    } = req.query;

    const query = {};

    if (trainer) query.trainer = trainer;
    if (status) query.status = status;

    // Filter by date
    if (date) {
      const selectedDate = new Date(date);
      query.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };

    const schedules = await Schedule.find(query)
      .populate('trainer', 'code user')
      .populate({
        path: 'trainer',
        populate: {
          path: 'user',
          select: 'fullName email avatar'
        }
      })
      .populate('createdBy', 'fullName email')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Schedule.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        schedules,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Lấy lịch dạy của HLV hiện tại
// @route     GET /api/schedules/my-schedules
// @access    Private (Trainer)
exports.getMySchedules = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    // Tìm trainer từ user
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin huấn luyện viên'
      });
    }

    const query = { trainer: trainer._id };

    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const schedules = await Schedule.find(query)
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: 'success',
      data: { schedules }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Lấy lịch dạy hôm nay của HLV
// @route     GET /api/schedules/my-today
// @access    Private (Trainer)
exports.getMyTodaySchedules = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin huấn luyện viên'
      });
    }

    const today = new Date();
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));


    const schedules = await Schedule.find({
      trainer: trainer._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ startTime: 1 });

    // Tính tổng thời gian
    const totalPlanned = schedules.reduce((sum, s) => sum + s.plannedDuration, 0);
    const totalActual = schedules.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    const completed = schedules.filter(s => s.status === 'completed').length;

    res.status(200).json({
      status: 'success',
      data: {
        schedules,
        summary: {
          total: schedules.length,
          completed,
          inProgress: schedules.filter(s => s.status === 'in_progress').length,
          scheduled: schedules.filter(s => s.status === 'scheduled').length,
          totalPlannedHours: (totalPlanned / 60).toFixed(2),
          totalActualHours: (totalActual / 60).toFixed(2),
          earnings: schedules.reduce((sum, s) => sum + (s.payment?.amount || 0), 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Lấy chi tiết lịch dạy
// @route     GET /api/schedules/:id
// @access    Private
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('trainer')
      .populate({
        path: 'trainer',
        populate: {
          path: 'user',
          select: 'fullName email phone avatar'
        }
      })
      .populate('createdBy', 'fullName email');

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch dạy'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Tạo lịch dạy mới
// @route     POST /api/schedules
// @access    Private (Admin/Manager)
exports.createSchedule = async (req, res) => {
  try {
    const {
      trainerId,
      title,
      subject,
      date,
      startTime,
      endTime,
      location,
      maxStudents,
      description,
      isRecurring,
      recurringPattern
    } = req.body;

    // Kiểm tra trainer
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy huấn luyện viên'
      });
    }

    // Kiểm tra trùng lịch cho HLV trong khoảng thời gian đó
    const conflict = await Schedule.findOne({
      trainer: trainerId,
      date: new Date(date),
      status: { $in: ['scheduled', 'in_progress'] }, // Chỉ kiểm tra với các lịch đang chờ hoặc đang diễn ra
      $or: [
        { // Logic kiểm tra sự chồng chéo thời gian
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        status: 'error',
        message: 'Huấn luyện viên đã có lịch dạy bị trùng trong khoảng thời gian này.'
      });
    }
    
    // Tạo mã lịch dạy (giả sử có phương thức này trong model)
    const scheduleCode = await Schedule.generateCode();

    const schedule = await Schedule.create({
      scheduleCode,
      trainer: trainerId,
      title,
      subject,
      date: new Date(date),
      startTime,
      endTime,
      location,
      maxStudents,
      description,
      isRecurring,
      recurringPattern,
      createdBy: req.user.id
    });
    
    // Populate thông tin để trả về response đầy đủ
    await schedule.populate({
      path: 'trainer',
      populate: {
        path: 'user',
        select: 'fullName email avatar'
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Tạo lịch dạy thành công',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};


// @desc      Cập nhật lịch dạy
// @route     PUT /api/schedules/:id
// @access    Private (Admin/Manager)
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch dạy'
      });
    }

    // Không cho phép update nếu đã completed
    if (schedule.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Không thể cập nhật lịch đã hoàn thành'
      });
    }

    const allowedFields = [
      'title', 'subject', 'date', 'startTime', 'endTime',
      'location', 'maxStudents', 'description', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        schedule[field] = req.body[field];
      }
    });

    await schedule.save();

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật lịch dạy thành công',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Xóa/Hủy lịch dạy
// @route     DELETE /api/schedules/:id
// @access    Private (Admin/Manager)
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch dạy'
      });
    }

    // Nếu đã check-in hoặc completed, chỉ cho phép hủy
    if (schedule.status === 'in_progress' || schedule.status === 'completed') {
      schedule.status = 'cancelled';
      await schedule.save();
      
      return res.status(200).json({
        status: 'success',
        message: 'Đã hủy lịch dạy'
      });
    }

    await schedule.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Xóa lịch dạy thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Check-in ca dạy
// @route     POST /api/schedules/:id/check-in
// @access    Private (Trainer)
exports.checkIn = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch dạy'
      });
    }

    // Kiểm tra quyền: chỉ HLV được phân công
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer || schedule.trainer.toString() !== trainer._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền check-in ca dạy này'
      });
    }

    // Kiểm tra trạng thái
    if (schedule.status !== 'scheduled') {
      return res.status(400).json({
        status: 'error',
        message: `Không thể check-in. Trạng thái hiện tại: ${schedule.status}`
      });
    }

    // Kiểm tra thời gian (không cho check-in quá sớm)
    const now = new Date();
    const scheduleDateTime = new Date(schedule.date);
    const [hours, minutes] = schedule.startTime.split(':');
    scheduleDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const diffMinutes = (scheduleDateTime - now) / (1000 * 60);
    if (diffMinutes > 30) {
      return res.status(400).json({
        status: 'error',
        message: 'Chưa đến giờ check-in (cho phép check-in trước 30 phút)'
      });
    }

    const { notes, location } = req.body;
    await schedule.checkInSession(notes, location); // Giả sử có phương thức này trong model

    res.status(200).json({
      status: 'success',
      message: 'Check-in thành công',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Check-out ca dạy (Hoàn thành)
// @route     POST /api/schedules/:id/check-out
// @access    Private (Trainer)
exports.checkOut = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch dạy'
      });
    }

    // Kiểm tra quyền
    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer || schedule.trainer.toString() !== trainer._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền check-out ca dạy này'
      });
    }

    // Kiểm tra trạng thái
    if (schedule.status !== 'in_progress') {
      return res.status(400).json({
        status: 'error',
        message: 'Ca dạy chưa được check-in'
      });
    }

    const { notes, actualStudents } = req.body;
    await schedule.checkOutSession(notes, actualStudents); // Giả sử có phương thức này trong model

    res.status(200).json({
      status: 'success',
      message: 'Check-out thành công. Ca dạy đã hoàn thành!',
      data: { 
        schedule,
        summary: {
          duration: `${schedule.actualDuration} phút (${(schedule.actualDuration / 60).toFixed(2)} giờ)`,
          payment: schedule.payment?.amount || 0,
          isOnTime: schedule.checkIn?.isOnTime || true
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Thống kê lịch dạy của HLV
// @route     GET /api/schedules/my-stats
// @access    Private (Trainer)
exports.getMyStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // day, week, month, year

    const trainer = await Trainer.findOne({ user: req.user.id });
    if (!trainer) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy thông tin huấn luyện viên'
      });
    }

    let startDate = new Date();
    
    switch(period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const schedules = await Schedule.find({
      trainer: trainer._id,
      date: { $gte: startDate },
      status: 'completed'
    });

    const totalHours = schedules.reduce((sum, s) => sum + (s.actualDuration || 0), 0) / 60;
    const totalEarnings = schedules.reduce((sum, s) => sum + (s.payment?.amount || 0), 0);
    const totalSessions = schedules.length;
    const totalStudents = schedules.reduce((sum, s) => sum + (s.checkOut?.actualStudents || 0), 0);

    res.status(200).json({
      status: 'success',
      data: {
        period,
        summary: {
          totalSessions,
          totalHours: totalHours.toFixed(2),
          totalEarnings,
          totalStudents,
          averageSessionDuration: totalSessions > 0 ? (totalHours * 60 / totalSessions).toFixed(2) : 0,
          averageEarningsPerSession: totalSessions > 0 ? (totalEarnings / totalSessions).toFixed(0) : 0
        },
        schedules
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc      Lấy lịch dạy theo tuần
// @route     GET /api/schedules/weekly
// @access    Private
exports.getWeeklySchedules = async (req, res) => {
  try {
    const { trainerId, startDate } = req.query;

    const query = {};
    if (trainerId) query.trainer = trainerId;

    // Tính toán tuần
    const weekStart = startDate ? new Date(startDate) : new Date();
    weekStart.setHours(0, 0, 0, 0);
    // Điều chỉnh để tuần bắt đầu từ Thứ Hai (ISO 8601)
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Nếu là Chủ Nhật (0) thì lùi 6 ngày, ngược lại lùi (day-1) ngày
    weekStart.setDate(diff);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    query.date = { $gte: weekStart, $lt: weekEnd };

    const schedules = await Schedule.find(query)
      .populate('trainer')
      .populate({
        path: 'trainer',
        populate: {
          path: 'user',
          select: 'fullName avatar'
        }
      })
      .sort({ date: 1, startTime: 1 });

    // Group by date
    const schedulesByDate = {};
    schedules.forEach(schedule => {
      const dateKey = schedule.date.toISOString().split('T')[0];
      if (!schedulesByDate[dateKey]) {
        schedulesByDate[dateKey] = [];
      }
      schedulesByDate[dateKey].push(schedule);
    });

    res.status(200).json({
      status: 'success',
      data: {
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: new Date(weekEnd.getTime() - 1).toISOString().split('T')[0], // Trả về ngày cuối của tuần
        schedulesByDate
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};