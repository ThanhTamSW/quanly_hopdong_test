const Contract = require('../models/Contract');
const Partner = require('../models/Partner');
const Notification = require('../models/Notification');
const fs = require('fs');

// @desc    Lấy danh sách hợp đồng (có phân trang, tìm kiếm, lọc)
// @route   GET /api/contracts
// @access  Private
exports.getContracts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      partner,
      type,
      sortBy = 'createdAt',
      order = 'desc',
      startDate,
      endDate
    } = req.query;

    const query = {};

    // Search theo tiêu đề hoặc số hợp đồng
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { contractNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Lọc theo trạng thái
    if (status) query.status = status;

    // Lọc theo đối tác
    if (partner) query.partner = partner;

    // Lọc theo loại hợp đồng
    if (type) query.type = type;

    // Lọc theo khoảng thời gian (ngày bắt đầu hoặc kết thúc)
    if (startDate || endDate) {
      query.$or = [];
      if (startDate)
        query.$or.push({ startDate: { $gte: new Date(startDate) } });
      if (endDate)
        query.$or.push({ endDate: { $lte: new Date(endDate) } });
    }

    // Phân trang
    const skip = (page - 1) * limit;

    // Sắp xếp
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sortBy]: sortOrder };

    // Truy vấn
    const contracts = await Contract.find(query)
      .populate('partner', 'name code type')
      .populate('createdBy', 'fullName email')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contract.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        contracts,
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

// @desc    Lấy chi tiết hợp đồng
// @route   GET /api/contracts/:id
// @access  Private
exports.getContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('partner')
      .populate('createdBy', 'fullName email avatar')
      .populate('lastModifiedBy', 'fullName email')
      .populate('history.changedBy', 'fullName email');

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hợp đồng'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { contract }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Tạo hợp đồng mới
// @route   POST /api/contracts
// @access  Private
exports.createContract = async (req, res) => {
  try {
    const {
      title,
      description,
      partner,
      type,
      value,
      currency,
      signDate,
      startDate,
      endDate,
      status,
      priority,
      paymentTerms,
      paymentMethod,
      signatories,
      tags,
      notes
    } = req.body;

    // Kiểm tra partner tồn tại
    const partnerExists = await Partner.findById(partner);
    if (!partnerExists) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đối tác'
      });
    }

    // Sinh số hợp đồng tự động
    const contractNumber = await Contract.generateContractNumber();

    const contract = await Contract.create({
      contractNumber,
      title,
      description,
      partner,
      type,
      value,
      currency,
      signDate,
      startDate,
      endDate,
      status: status || 'draft',
      priority,
      paymentTerms,
      paymentMethod,
      signatories,
      tags,
      notes,
      createdBy: req.user.id,
      history: [{
        action: 'created',
        description: 'Hợp đồng được tạo',
        changedBy: req.user.id
      }]
    });

    await contract.populate('partner', 'name code');
    await contract.populate('createdBy', 'fullName email');

    res.status(201).json({
      status: 'success',
      message: 'Tạo hợp đồng thành công',
      data: { contract }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Cập nhật hợp đồng
// @route   PUT /api/contracts/:id
// @access  Private
exports.updateContract = async (req, res) => {
  try {
    let contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hợp đồng'
      });
    }

    const oldValues = { ...contract.toObject() };

    const allowedFields = [
      'title', 'description', 'partner', 'type', 'value', 'currency',
      'signDate', 'startDate', 'endDate', 'status', 'priority',
      'paymentTerms', 'paymentMethod', 'signatories', 'tags', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        contract[field] = req.body[field];
      }
    });

    contract.lastModifiedBy = req.user.id;

    // Ghi lại thay đổi
    const changes = {};
    allowedFields.forEach(field => {
      if (
        req.body[field] !== undefined &&
        JSON.stringify(oldValues[field]) !== JSON.stringify(req.body[field])
      ) {
        changes[field] = {
          old: oldValues[field],
          new: req.body[field]
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      contract.addHistory('updated', 'Hợp đồng được cập nhật', req.user.id, changes);
    }

    await contract.save();

    await contract.populate('partner', 'name code');
    await contract.populate('createdBy', 'fullName email');

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật hợp đồng thành công',
      data: { contract }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Xóa hợp đồng
// @route   DELETE /api/contracts/:id
// @access  Private (Admin/Manager)
exports.deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hợp đồng'
      });
    }

    await contract.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Xóa hợp đồng thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Lấy hợp đồng sắp hết hạn
// @route   GET /api/contracts/expiring
// @access  Private
exports.getExpiringContracts = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const contracts = await Contract.find({
      status: 'active',
      endDate: {
        $gte: today,
        $lte: futureDate
      }
    })
      .populate('partner', 'name code')
      .populate('createdBy', 'fullName email')
      .sort({ endDate: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        count: contracts.length,
        contracts
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Upload file đính kèm
// @route   POST /api/contracts/:id/attachments
// @access  Private
exports.addAttachment = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hợp đồng'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng upload file'
      });
    }

    contract.attachments.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    contract.addHistory('file_added', `Thêm file: ${req.file.originalname}`, req.user.id);

    await contract.save();

    res.status(200).json({
      status: 'success',
      message: 'Upload file thành công',
      data: { 
        attachment: contract.attachments[contract.attachments.length - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Xóa file đính kèm
// @route   DELETE /api/contracts/:id/attachments/:attachmentId
// @access  Private
exports.removeAttachment = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hợp đồng'
      });
    }

    const attachment = contract.attachments.id(req.params.attachmentId);
    
    if (!attachment) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy file'
      });
    }

    // Xóa file vật lý
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    contract.attachments.pull(req.params.attachmentId);
    contract.addHistory('file_removed', `Xóa file: ${attachment.originalName}`, req.user.id);

    await contract.save();

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
};
