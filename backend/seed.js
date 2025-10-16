// seed.js - Script tạo dữ liệu mẫu
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Partner = require('./src/models/Partner');
const Contract = require('./src/models/Contract');
const Trainer = require('./src/models/Trainer');
const Schedule = require('./src/models/Schedule');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🔄 Đang kết nối MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB\n');

    // Xóa dữ liệu cũ
    console.log('🗑️  Đang xóa dữ liệu cũ...');
    await User.deleteMany({});
    await Partner.deleteMany({});
    await Contract.deleteMany({});
    await Trainer.deleteMany({});
    await Schedule.deleteMany({});
    console.log('✅ Đã xóa dữ liệu cũ\n');

    // ==================== TẠO USERS ====================
    console.log('👥 Đang tạo users...');
    
    const admin = await User.create({
      email: 'admin@example.com',
      password: '123456',
      fullName: 'Nguyễn Văn Admin',
      role: 'admin',
      phone: '0123456789',
      department: 'Quản trị',
      position: 'Giám đốc',
      status: 'active'
    });

    const manager = await User.create({
      email: 'manager@example.com',
      password: '123456',
      fullName: 'Trần Thị Manager',
      role: 'manager',
      phone: '0987654321',
      department: 'Kinh doanh',
      position: 'Trưởng phòng',
      status: 'active'
    });

    const user = await User.create({
      email: 'user@example.com',
      password: '123456',
      fullName: 'Lê Văn User',
      role: 'user',
      phone: '0976543210',
      department: 'Hành chính',
      position: 'Nhân viên',
      status: 'active'
    });

    console.log('✅ Đã tạo 3 users\n');

    // ==================== TẠO PARTNERS ====================
    console.log('🤝 Đang tạo partners...');

    const partners = await Partner.insertMany([
      {
        code: 'PT00001',
        name: 'Công ty TNHH Công nghệ ABC',
        type: 'client',
        contactPerson: 'Nguyễn Văn A',
        email: 'contact@abc.com',
        phone: '0281234567',
        address: {
          street: '123 Đường Lê Lợi',
          city: 'Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          country: 'Vietnam'
        },
        taxCode: '0123456789',
        bankInfo: {
          bankName: 'Vietcombank',
          accountNumber: '0123456789',
          accountName: 'CONG TY TNHH CONG NGHE ABC',
          branch: 'Chi nhánh TP.HCM'
        },
        website: 'https://abc.com',
        industry: 'Công nghệ thông tin',
        status: 'active',
        rating: 5,
        createdBy: admin._id
      },
      {
        code: 'PT00002',
        name: 'Công ty CP Thiết bị XYZ',
        type: 'supplier',
        contactPerson: 'Trần Thị B',
        email: 'info@xyz.com',
        phone: '0287654321',
        address: {
          street: '456 Đường Nguyễn Huệ',
          city: 'Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Thành',
          country: 'Vietnam'
        },
        taxCode: '9876543210',
        website: 'https://xyz.com',
        industry: 'Thương mại',
        status: 'active',
        rating: 4,
        createdBy: admin._id
      },
      {
        code: 'PT00003',
        name: 'Công ty TNHH Tư vấn DEF',
        type: 'partner',
        contactPerson: 'Lê Văn C',
        email: 'contact@def.com',
        phone: '0283456789',
        address: {
          street: '789 Đường Võ Văn Tần',
          city: 'Hồ Chí Minh',
          district: 'Quận 3',
          ward: 'Phường Võ Thị Sáu',
          country: 'Vietnam'
        },
        taxCode: '5555666677',
        website: 'https://def.com',
        industry: 'Tư vấn',
        status: 'active',
        rating: 5,
        createdBy: manager._id
      },
      {
        code: 'PT00004',
        name: 'Công ty CP Logistics GHI',
        type: 'supplier',
        contactPerson: 'Phạm Thị D',
        email: 'support@ghi.com',
        phone: '0289876543',
        address: {
          street: '321 Đường Điện Biên Phủ',
          city: 'Hồ Chí Minh',
          district: 'Quận Bình Thạnh',
          country: 'Vietnam'
        },
        taxCode: '7777888899',
        industry: 'Logistics',
        status: 'active',
        rating: 4,
        createdBy: manager._id
      },
      {
        code: 'PT00005',
        name: 'Công ty TNHH Xây dựng JKL',
        type: 'client',
        contactPerson: 'Hoàng Văn E',
        email: 'info@jkl.com',
        phone: '0285432109',
        address: {
          street: '654 Đường Cách Mạng Tháng 8',
          city: 'Hồ Chí Minh',
          district: 'Quận 10',
          country: 'Vietnam'
        },
        taxCode: '1111222233',
        industry: 'Xây dựng',
        status: 'active',
        rating: 3,
        createdBy: user._id
      }
    ]);

    console.log('✅ Đã tạo 5 partners\n');

    // ==================== TẠO CONTRACTS ====================
    console.log('📄 Đang tạo contracts...');

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const sixMonthsLater = new Date(today);
    sixMonthsLater.setMonth(today.getMonth() + 6);
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);
    const twentyDaysLater = new Date(today);
    twentyDaysLater.setDate(today.getDate() + 20);

    const contracts = await Contract.insertMany([
      {
        contractNumber: 'HD202500001',
        title: 'Hợp đồng cung cấp phần mềm quản lý',
        description: 'Cung cấp và triển khai hệ thống quản lý doanh nghiệp',
        partner: partners[0]._id,
        type: 'service',
        value: 500000000,
        currency: 'VND',
        signDate: twoMonthsAgo,
        startDate: twoMonthsAgo,
        endDate: oneYearLater,
        status: 'active',
        priority: 'high',
        paymentTerms: 'Thanh toán 3 đợt: 30% - 40% - 30%',
        paymentMethod: 'bank_transfer',
        signatories: [
          {
            name: 'Nguyễn Văn Admin',
            position: 'Giám đốc',
            organization: 'Công ty chúng tôi'
          },
          {
            name: 'Nguyễn Văn A',
            position: 'Giám đốc',
            organization: 'Công ty TNHH Công nghệ ABC'
          }
        ],
        tags: ['phần mềm', 'IT', 'ưu tiên cao'],
        notes: 'Hợp đồng quan trọng, cần theo dõi tiến độ',
        createdBy: admin._id,
        history: [{
          action: 'created',
          description: 'Hợp đồng được tạo',
          changedBy: admin._id
        }]
      },
      {
        contractNumber: 'HD202500002',
        title: 'Hợp đồng mua thiết bị văn phòng',
        description: 'Mua 50 máy tính, máy in và phụ kiện',
        partner: partners[1]._id,
        type: 'purchase',
        value: 300000000,
        currency: 'VND',
        signDate: oneMonthAgo,
        startDate: oneMonthAgo,
        endDate: today,
        status: 'completed',
        priority: 'medium',
        paymentTerms: 'Thanh toán ngay khi giao hàng',
        paymentMethod: 'bank_transfer',
        tags: ['thiết bị', 'văn phòng'],
        notes: 'Đã hoàn thành và nghiệm thu',
        createdBy: manager._id,
        history: [
          {
            action: 'created',
            description: 'Hợp đồng được tạo',
            changedBy: manager._id
          },
          {
            action: 'status_changed',
            description: 'Chuyển trạng thái sang Completed',
            changedBy: manager._id
          }
        ]
      },
      {
        contractNumber: 'HD202500003',
        title: 'Hợp đồng tư vấn chiến lược kinh doanh',
        description: 'Tư vấn và xây dựng kế hoạch kinh doanh 2025',
        partner: partners[2]._id,
        type: 'service',
        value: 150000000,
        currency: 'VND',
        signDate: today,
        startDate: today,
        endDate: twentyDaysLater,
        status: 'active',
        priority: 'urgent',
        paymentTerms: 'Thanh toán 2 đợt: 50% - 50%',
        paymentMethod: 'bank_transfer',
        tags: ['tư vấn', 'sắp hết hạn'],
        notes: 'Hợp đồng sắp hết hạn, cần chú ý',
        createdBy: admin._id,
        history: [{
          action: 'created',
          description: 'Hợp đồng được tạo',
          changedBy: admin._id
        }]
      },
      {
        contractNumber: 'HD202500004',
        title: 'Hợp đồng vận chuyển hàng hóa',
        description: 'Dịch vụ vận chuyển hàng hóa nội địa',
        partner: partners[3]._id,
        type: 'service',
        value: 80000000,
        currency: 'VND',
        signDate: today,
        startDate: today,
        endDate: sixMonthsLater,
        status: 'active',
        priority: 'low',
        paymentTerms: 'Thanh toán hàng tháng',
        paymentMethod: 'bank_transfer',
        tags: ['logistics', 'dài hạn'],
        createdBy: manager._id,
        history: [{
          action: 'created',
          description: 'Hợp đồng được tạo',
          changedBy: manager._id
        }]
      },
      {
        contractNumber: 'HD202500005',
        title: 'Hợp đồng xây dựng văn phòng mới',
        description: 'Xây dựng và hoàn thiện văn phòng chi nhánh',
        partner: partners[4]._id,
        type: 'lease',
        value: 2000000000,
        currency: 'VND',
        signDate: today,
        startDate: today,
        endDate: oneYearLater,
        status: 'pending',
        priority: 'high',
        paymentTerms: 'Thanh toán theo tiến độ',
        paymentMethod: 'installment',
        tags: ['xây dựng', 'dự án lớn'],
        notes: 'Dự án trọng điểm năm 2025',
        createdBy: admin._id,
        history: [{
          action: 'created',
          description: 'Hợp đồng được tạo',
          changedBy: admin._id
        }]
      },
      {
        contractNumber: 'HD202500006',
        title: 'Hợp đồng bảo trì hệ thống',
        description: 'Bảo trì và nâng cấp hệ thống IT',
        partner: partners[0]._id,
        type: 'service',
        value: 120000000,
        currency: 'VND',
        signDate: oneMonthAgo,
        startDate: oneMonthAgo,
        endDate: oneYearLater,
        status: 'active',
        priority: 'medium',
        paymentTerms: 'Thanh toán hàng quý',
        paymentMethod: 'bank_transfer',
        tags: ['bảo trì', 'IT'],
        createdBy: user._id,
        history: [{
          action: 'created',
          description: 'Hợp đồng được tạo',
          changedBy: user._id
        }]
      }
    ]);

    console.log('✅ Đã tạo 6 contracts\n');

    // ==================== TẠO TRAINERS ====================
    console.log('🏋️ Đang tạo trainers...');

    const trainer1 = await Trainer.create({
      user: user._id,
      code: 'TR0001',
      specialties: ['Yoga', 'Pilates', 'Meditation'],
      hourlyRate: 200000,
      experience: 3,
      bio: 'Huấn luyện viên Yoga chuyên nghiệp với 3 năm kinh nghiệm',
      languages: ['Vietnamese', 'English'],
      certifications: [{
        name: 'Yoga Alliance RYT 200',
        issuer: 'Yoga Alliance',
        issueDate: new Date('2022-01-15')
      }],
      workingHours: {
        monday: { start: '06:00', end: '20:00', available: true },
        tuesday: { start: '06:00', end: '20:00', available: true },
        wednesday: { start: '06:00', end: '20:00', available: true },
        thursday: { start: '06:00', end: '20:00', available: true },
        friday: { start: '06:00', end: '20:00', available: true },
        saturday: { start: '08:00', end: '18:00', available: true },
        sunday: { available: false }
      },
      status: 'active'
    });

    const trainer2 = await Trainer.create({
      user: manager._id,
      code: 'TR0002',
      specialties: ['Gym', 'Personal Training', 'Boxing'],
      hourlyRate: 250000,
      experience: 5,
      bio: 'HLV gym và boxing với 5 năm kinh nghiệm tại các phòng gym hàng đầu',
      languages: ['Vietnamese'],
      certifications: [{
        name: 'Certified Personal Trainer',
        issuer: 'NASM',
        issueDate: new Date('2020-06-01')
      }],
      workingHours: {
        monday: { start: '07:00', end: '21:00', available: true },
        tuesday: { start: '07:00', end: '21:00', available: true },
        wednesday: { start: '07:00', end: '21:00', available: true },
        thursday: { start: '07:00', end: '21:00', available: true },
        friday: { start: '07:00', end: '21:00', available: true },
        saturday: { start: '09:00', end: '17:00', available: true },
        sunday: { start: '09:00', end: '13:00', available: true }
      },
      status: 'active'
    });

    console.log('✅ Đã tạo 2 trainers\n');

    // ==================== TẠO SCHEDULES ====================
    console.log('📅 Đang tạo schedules...');

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    // Lịch hôm nay
    const schedule1 = await Schedule.create({
      scheduleCode: await Schedule.generateCode(),
      trainer: trainer1._id,
      title: 'Lớp Yoga buổi sáng',
      subject: 'Yoga',
      date: today,
      startTime: '08:00',
      endTime: '09:30',
      location: 'Phòng Yoga 1',
      maxStudents: 20,
      description: 'Lớp Yoga cơ bản cho người mới bắt đầu',
      students: [
        { name: 'Nguyễn Thị A', email: 'a@example.com', phone: '0901111111' },
        { name: 'Trần Văn B', email: 'b@example.com', phone: '0902222222' }
      ],
      status: 'scheduled',
      createdBy: admin._id
    });

    const schedule2 = await Schedule.create({
      scheduleCode: await Schedule.generateCode(),
      trainer: trainer1._id,
      title: 'Lớp Yoga buổi chiều',
      subject: 'Yoga',
      date: today,
      startTime: '17:00',
      endTime: '18:30',
      location: 'Phòng Yoga 1',
      maxStudents: 20,
      description: 'Lớp Yoga nâng cao',
      status: 'scheduled',
      createdBy: admin._id
    });

    const schedule3 = await Schedule.create({
      scheduleCode: await Schedule.generateCode(),
      trainer: trainer2._id,
      title: 'Lớp Gym buổi sáng',
      subject: 'Gym',
      date: today,
      startTime: '07:00',
      endTime: '08:00',
      location: 'Khu Gym tầng 2',
      maxStudents: 15,
      description: 'Luyện tập gym cơ bản',
      students: [
        { name: 'Lê Văn C', email: 'c@example.com', phone: '0903333333' }
      ],
      status: 'scheduled',
      createdBy: admin._id
    });

    // Lịch ngày mai
    await Schedule.create({
      scheduleCode: await Schedule.generateCode(),
      trainer: trainer1._id,
      title: 'Lớp Yoga buổi sáng',
      subject: 'Yoga',
      date: tomorrow,
      startTime: '08:00',
      endTime: '09:30',
      location: 'Phòng Yoga 1',
      maxStudents: 20,
      status: 'scheduled',
      createdBy: admin._id
    });

    await Schedule.create({
      scheduleCode: await Schedule.generateCode(),
      trainer: trainer2._id,
      title: 'Personal Training',
      subject: 'Personal Training',
      date: tomorrow,
      startTime: '15:00',
      endTime: '16:00',
      location: 'Khu PT riêng',
      maxStudents: 1,
      description: 'Buổi PT 1-1',
      status: 'scheduled',
      createdBy: admin._id
    });

    // Lịch đã hoàn thành (hôm qua)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const completedSchedule = await Schedule.create({
      scheduleCode: 'SCH' + yesterday.toISOString().split('T')[0].replace(/-/g, '') + '001',
      trainer: trainer1._id,
      title: 'Lớp Yoga đã hoàn thành',
      subject: 'Yoga',
      date: yesterday,
      startTime: '08:00',
      endTime: '09:30',
      location: 'Phòng Yoga 1',
      maxStudents: 20,
      status: 'completed',
      checkIn: {
        time: new Date(yesterday.setHours(8, 5, 0, 0)),
        notes: 'Đã sẵn sàng',
        location: 'Phòng Yoga 1'
      },
      checkOut: {
        time: new Date(yesterday.setHours(9, 35, 0, 0)),
        notes: 'Buổi học rất tốt',
        actualStudents: 18
      },
      actualDuration: 90,
      plannedDuration: 90,
      payment: {
        amount: 300000,
        isPaid: false
      },
      createdBy: admin._id
    });

    console.log('✅ Đã tạo 6 schedules\n');

    // ==================== THỐNG KÊ ====================
    console.log('📊 THỐNG KÊ DỮ LIỆU');
    console.log('='.repeat(50));
    console.log(`👥 Users: ${await User.countDocuments()}`);
    console.log(`   - Admin: ${await User.countDocuments({ role: 'admin' })}`);
    console.log(`   - Manager: ${await User.countDocuments({ role: 'manager' })}`);
    console.log(`   - User: ${await User.countDocuments({ role: 'user' })}`);
    console.log('');
    console.log(`🤝 Partners: ${await Partner.countDocuments()}`);
    console.log(`   - Client: ${await Partner.countDocuments({ type: 'client' })}`);
    console.log(`   - Supplier: ${await Partner.countDocuments({ type: 'supplier' })}`);
    console.log(`   - Partner: ${await Partner.countDocuments({ type: 'partner' })}`);
    console.log('');
    console.log(`📄 Contracts: ${await Contract.countDocuments()}`);
    console.log(`   - Active: ${await Contract.countDocuments({ status: 'active' })}`);
    console.log(`   - Completed: ${await Contract.countDocuments({ status: 'completed' })}`);
    console.log(`   - Pending: ${await Contract.countDocuments({ status: 'pending' })}`);
    console.log('');
    console.log(`🏋️ Trainers: ${await Trainer.countDocuments()}`);
    console.log(`   - Active: ${await Trainer.countDocuments({ status: 'active' })}`);
    console.log('');
    console.log(`📅 Schedules: ${await Schedule.countDocuments()}`);
    console.log(`   - Scheduled: ${await Schedule.countDocuments({ status: 'scheduled' })}`);
    console.log(`   - Completed: ${await Schedule.countDocuments({ status: 'completed' })}`);
    console.log('='.repeat(50));
    console.log('');

    // ==================== THÔNG TIN ĐĂNG NHẬP ====================
    console.log('🔑 THÔNG TIN ĐĂNG NHẬP');
    console.log('='.repeat(50));
    console.log('📧 Admin:');
    console.log('   Email: admin@example.com');
    console.log('   Password: 123456');
    console.log('   Role: Admin (Quản lý toàn bộ hệ thống)');
    console.log('');
    console.log('📧 Manager (cũng là Trainer):');
    console.log('   Email: manager@example.com');
    console.log('   Password: 123456');
    console.log('   Role: Manager + Trainer');
    console.log('   Hourly Rate: 250,000 VND');
    console.log('');
    console.log('📧 User (cũng là Trainer):');
    console.log('   Email: user@example.com');
    console.log('   Password: 123456');
    console.log('   Role: User + Trainer');
    console.log('   Hourly Rate: 200,000 VND');
    console.log('='.repeat(50));
    console.log('');
    console.log('💡 HƯỚNG DẪN SỬ DỤNG:');
    console.log('1. Đăng nhập bằng user@example.com');
    console.log('2. Vào /api/schedules/my-today để xem lịch hôm nay');
    console.log('3. Check-in ca dạy bằng POST /api/schedules/:id/check-in');
    console.log('4. Check-out ca dạy bằng POST /api/schedules/:id/check-out');
    console.log('5. Xem thống kê tại /api/schedules/my-stats');
    console.log('');(50);
    console.log('');

    console.log('✅ Seed data hoàn tất!');
    console.log('🚀 Bây giờ bạn có thể:');
    console.log('   - Đăng nhập và quản lý hợp đồng');
    console.log('   - Quản lý lịch dạy của huấn luyện viên');
    console.log('   - Check-in/Check-out ca dạy');
    console.log('   - Xem thống kê chi tiết');
    console.log('');
    console.log('📚 Xem thêm tài liệu tại README.md');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
    process.exit(1);
  }
};

// Chạy seed
seedData();