const mongoose = require('mongoose');
const { v5: uuidv5 } = require('uuid');
const bcrypt = require('bcryptjs');

// Same UUID namespace from your User model
const UUID_NAMESPACE = '3f96061a-3a25-4f89-9ae9-abc012345678';

// User roles and statuses from your types
const roles = ['admin', 'doctor', 'employee', 'patient'];
const statuses = ['active', 'inactive', 'suspended'];

// User schema (simplified version of your model)
const userSchema = new mongoose.Schema({
    _id: String,
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    status: { type: String, enum: statuses, default: 'active' }
}, {
    _id: false,
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

// Sample data generators
const firstNames = [
    'Anh', 'Bình', 'Châu', 'Dũng', 'Đức', 'Giang', 'Hà', 'Hải', 'Hạnh', 'Hiếu',
    'Hoa', 'Hoài', 'Hùng', 'Khánh', 'Kiên', 'Lan', 'Linh', 'Loan', 'Mai', 'Minh',
    'My', 'Nam', 'Ngân', 'Ngọc', 'Nhân', 'Nhi', 'Phát', 'Phúc', 'Phương', 'Quân',
    'Quang', 'Quỳnh', 'Sơn', 'Tâm', 'Tân', 'Thảo', 'Thành', 'Thảo', 'Thắng', 'Thảo',
    'Thịnh', 'Thu', 'Thủy', 'Trang', 'Trí', 'Trinh', 'Trung', 'Tú', 'Tuấn', 'Vân',
    'Việt', 'Vy'
];

const lastNames = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh', 'Hà', 'Mai',
    'Đoàn', 'Lâm', 'Vương', 'Phùng', 'Quách', 'Tạ', 'Tô', 'Tăng', 'Cao', 'Châu',
    'Chung', 'Đàm', 'Đào', 'Đinh', 'Giang', 'Hứa', 'Kiều', 'La', 'Lưu', 'Mạc',
    'Nghiêm', 'Ông', 'Tống', 'Triệu', 'Trương', 'Từ', 'Vi', 'Văn', 'Vương', 'Yên',
    'Quang', 'Thái', 'Phước', 'Thạch'
];

const addresses = [
    '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    '45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    '78 Trần Phú, Hải Châu, Đà Nẵng',
    '23 Lê Lợi, Nha Trang, Khánh Hòa',
    '56 Nguyễn Văn Cừ, Long Biên, Hà Nội',
    '89 Phạm Văn Đồng, Thủ Đức, TP. Hồ Chí Minh',
    '34 Trường Chinh, Thanh Xuân, Hà Nội',
    '67 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh',
    '90 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh',
    '21 Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh',
    '54 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
    '76 Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
    '32 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
    '88 Lê Hồng Phong, Quận 10, TP. Hồ Chí Minh',
    '15 Bạch Đằng, Hải Châu, Đà Nẵng'
];

// Generate random Vietnamese phone number
function generatePhone() {
    // Format: +84xxxxxxxxx (Vietnamese mobile numbers)
    const prefixes = ['+8490', '+8491', '+8493', '+8496', '+8497', '+8498', '+8483', '+8484', '+8485', '+8481', '+8482'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(1000000 + Math.random() * 9000000);
    return prefix + number;
}

// Generate random date of birth (18-80 years old)
function generateDateOfBirth() {
    const now = new Date();
    const minAge = 18;
    const maxAge = 80;
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const birthYear = now.getFullYear() - age;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1; // Safe day range
    return new Date(birthYear, birthMonth, birthDay);
}

// Generate random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Determine role based on user number
function getRoleByNumber(num) {
    if (num >= 1 && num <= 10) return 'admin';
    if (num >= 11 && num <= 100) return 'doctor';
    if (num >= 201 && num <= 300) return 'employee';
    if (num >= 301 && num <= 1000) return 'patient';
    return 'patient'; // fallback
}

// Generate user data
async function generateUser(num) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const username = `user_${num.toString()}`;
    const role = getRoleByNumber(num);

    // Generate UUIDv5 based on username
    const userId = uuidv5(username, UUID_NAMESPACE);

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 12);

    return {
        _id: userId,
        email: `${username}@example.com`,
        username: username,
        phone: generatePhone(),
        address: randomElement(addresses),
        dateOfBirth: generateDateOfBirth(),
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        role: role,
        status: 'active'
    };
}

// Main seeding function
async function seedUsers() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/user-management?authSource=admin';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Generate users in batches
        const batchSize = 50;
        const userNumbers = [];

        // Add user numbers based on role distribution
        // 1-10: admin
        for (let i = 1; i <= 10; i++) {
            userNumbers.push(i);
        }

        // 11-100: doctor
        for (let i = 11; i <= 100; i++) {
            userNumbers.push(i);
        }

        // 201-300: employee
        for (let i = 101; i <= 300; i++) {
            userNumbers.push(i);
        }

        // 301-1000: patient
        for (let i = 301; i <= 1000; i++) {
            userNumbers.push(i);
        }

        console.log(`Generating ${userNumbers.length} users...`);

        // Process in batches
        for (let i = 0; i < userNumbers.length; i += batchSize) {
            const batch = userNumbers.slice(i, i + batchSize);
            const users = await Promise.all(batch.map(generateUser));

            await User.insertMany(users);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(userNumbers.length / batchSize)} (${users.length} users)`);
        }

        // Display statistics
        const stats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        console.log('\n=== Seeding Complete ===');
        console.log('User distribution by role:');
        stats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} users`);
        });

        const totalUsers = await User.countDocuments();
        console.log(`\nTotal users created: ${totalUsers}`);

        // Sample users for verification
        console.log('\n=== Sample Users ===');
        const sampleAdmin = await User.findOne({ role: 'admin' });
        const sampleDoctor = await User.findOne({ role: 'doctor' });
        const sampleEmployee = await User.findOne({ role: 'employee' });
        const samplePatient = await User.findOne({ role: 'patient' });

        console.log('Sample Admin:', {
            id: sampleAdmin._id,
            username: sampleAdmin.username,
            email: sampleAdmin.email,
            role: sampleAdmin.role
        });

        console.log('Sample Doctor:', {
            id: sampleDoctor._id,
            username: sampleDoctor.username,
            email: sampleDoctor.email,
            role: sampleDoctor.role
        });

        console.log('Sample Employee:', {
            id: sampleEmployee._id,
            username: sampleEmployee.username,
            email: sampleEmployee.email,
            role: sampleEmployee.role
        });

        console.log('Sample Patient:', {
            id: samplePatient._id,
            username: samplePatient.username,
            email: samplePatient.email,
            role: samplePatient.role
        });

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeder
if (require.main === module) {
    seedUsers().catch(console.error);
}

module.exports = { seedUsers };