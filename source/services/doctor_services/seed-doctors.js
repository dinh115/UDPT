/***
 * TO RUN THIS FILE: node seed-doctors.js
 */


const mongoose = require('mongoose');
const { v5: uuidv5, v4: uuidv4, validate: isUUID } = require('uuid');

// Same namespace from your Doctor model
const NAMESPACE = '3f96061a-3a25-4f89-9ae9-abc012345678';

// Days of the week enum
const DayOfWeek = {
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
    SUNDAY: 'SUNDAY'
};

// Time slot schema
const timeSlotSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    startTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
    },
    endTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// Availability schema
const availabilitySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    day: {
        type: String,
        enum: Object.values(DayOfWeek),
        required: true
    },
    slots: [timeSlotSchema]
}, { _id: false });

// Doctor schema
const doctorSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function () {
            return uuidv5(this.userId, NAMESPACE);
        },
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return isUUID(v);
            },
            message: 'User ID must be a valid UUID',
        },
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
        maxlength: [100, 'Specialization cannot be more than 100 characters']
    },
    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [0, 'Experience cannot be negative'],
        max: [50, 'Experience cannot be more than 50 years']
    },
    qualifications: {
        type: [String],
        validate: {
            validator: function (qualifications) {
                return qualifications.length > 0;
            },
            message: 'At least one qualification is required'
        }
    },
    availability: [availabilitySchema]
}, {
    timestamps: true,
    _id: false
});

// Index for better query performance
doctorSchema.index({ specialization: 1, 'availability.day': 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

// Medical specializations
const specializations = [
    'Tim mạch',
    'Thần kinh',
    'Chỉnh hình',
    'Nhi khoa',
    'Da liễu',
    'Y học tổng quát',
    'Phẫu thuật',
    'Ung thư'
];

// Medical qualifications by specialization
const qualificationsBySpecialization = {
    'Tim mạch': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Tim mạch',
        'Chứng chỉ Nội soi Tim mạch can thiệp'
    ],
    'Thần kinh': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Thần kinh',
        'Chứng chỉ chuyên sâu về Đột quỵ'
    ],
    'Chỉnh hình': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Chỉnh hình',
        'Chứng chỉ chuyên sâu về Y học thể thao'
    ],
    'Nhi khoa': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Nhi',
        'Chứng chỉ chuyên sâu về Tim mạch Nhi'
    ],
    'Da liễu': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Da liễu',
        'Chứng chỉ chuyên sâu về Giải phẫu bệnh da'
    ],
    'Y học tổng quát': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Nội tổng quát',
        'Chứng chỉ chuyên sâu về Y học nội trú'
    ],
    'Phẫu thuật': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Ngoại tổng quát',
        'Chứng chỉ chuyên sâu về Phẫu thuật chấn thương'
    ],
    'Ung thư': [
        'Bác sĩ Y khoa (MD)',
        'Chứng chỉ chuyên khoa Ung bướu',
        'Chứng chỉ chuyên sâu về Ung thư nội khoa'
    ]
};

// Common time slots for appointments
const timeSlots = [
    { start: '08:00', end: '08:30' },
    { start: '08:30', end: '09:00' },
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:00', end: '15:30' },
    { start: '15:30', end: '16:00' },
    { start: '16:00', end: '16:30' },
    { start: '16:30', end: '17:00' },
    { start: '17:00', end: '17:30' },
    { start: '17:30', end: '18:00' }
];

// Generate random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate random elements from array
function randomElements(array, min = 1, max = 3) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generate working days (3-6 days per week)
function generateWorkingDays() {
    const allDays = Object.values(DayOfWeek);
    const workingDaysCount = Math.floor(Math.random() * 4) + 3; // 3-6 days
    return randomElements(allDays, workingDaysCount, workingDaysCount);
}

// Generate time slots for a day
function generateDaySlots() {
    const slotsCount = Math.floor(Math.random() * 8) + 4; // 4-12 slots per day
    const selectedSlots = randomElements(timeSlots, slotsCount, slotsCount);

    return selectedSlots.map(slot => ({
        _id: uuidv4(),
        startTime: slot.start,
        endTime: slot.end,
        isBooked: Math.random() < 0.1 // 10% chance of being booked
    }));
}

// Generate availability for a doctor
function generateAvailability() {
    const workingDays = generateWorkingDays();

    return workingDays.map(day => ({
        _id: uuidv4(),
        day: day,
        slots: generateDaySlots()
    }));
}

// Get user IDs for doctors from user service
async function getDoctorUserIds() {
    try {
        // Connect to user service database to get doctor user IDs
        const userMongoUri = process.env.USER_MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/user-management?authSource=admin';
        const userConnection = await mongoose.createConnection(userMongoUri);

        const UserSchema = new mongoose.Schema({
            _id: String,
            role: String
        });

        const User = userConnection.model('User', UserSchema);
        const doctorUsers = await User.find({ role: 'doctor' }).select('_id');

        await userConnection.close();

        return doctorUsers.map(user => user._id);
    } catch (error) {
        console.error('Error fetching doctor user IDs:', error);
        throw error;
    }
}

// Generate doctor data
function generateDoctor(userId) {
    const specialization = randomElement(specializations);
    const experience = Math.floor(Math.random() * 25) + 1; // 1-25 years
    const qualifications = qualificationsBySpecialization[specialization] || ['Bác sĩ Y khoa (MD)', 'Đã hoàn thành chương trình đào tạo'];

    return {
        userId: userId,
        specialization: specialization,
        experience: experience,
        qualifications: qualifications,
        availability: generateAvailability()
    };
}

// Main seeding function
async function seedDoctors() {
    try {
        // Connect to doctor service database
        const doctorMongoUri = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27018/doctor-management?authSource=admin';
        await mongoose.connect(doctorMongoUri);
        console.log('Connected to Doctor MongoDB');

        // Clear existing doctors
        await Doctor.deleteMany({});
        console.log('Cleared existing doctors');

        // Get doctor user IDs from user service
        console.log('Fetching doctor user IDs from user service...');
        const doctorUserIds = await getDoctorUserIds();
        console.log(`Found ${doctorUserIds.length} doctor users`);

        if (doctorUserIds.length === 0) {
            console.log('No doctor users found. Please seed the user service first.');
            return;
        }

        // Generate doctors in batches
        const batchSize = 50;
        console.log(`Generating ${doctorUserIds.length} doctors...`);

        for (let i = 0; i < doctorUserIds.length; i += batchSize) {
            const batch = doctorUserIds.slice(i, i + batchSize);
            const doctors = batch.map(userId => generateDoctor(userId));

            await Doctor.insertMany(doctors);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(doctorUserIds.length / batchSize)} (${doctors.length} doctors)`);
        }

        // Display statistics
        const stats = await Doctor.aggregate([
            {
                $group: {
                    _id: '$specialization',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        console.log('\n=== Seeding Complete ===');
        console.log('Doctor distribution by specialization:');
        stats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} doctors`);
        });

        const totalDoctors = await Doctor.countDocuments();
        console.log(`\nTotal doctors created: ${totalDoctors}`);

        // Sample doctors for verification
        console.log('\n=== Sample Doctors ===');
        const sampleDoctors = await Doctor.find().limit(3);

        sampleDoctors.forEach((doctor, index) => {
            console.log(`\nSample Doctor ${index + 1}:`);
            console.log(`ID: ${doctor._id}`);
            console.log(`User ID: ${doctor.userId}`);
            console.log(`Specialization: ${doctor.specialization}`);
            console.log(`Experience: ${doctor.experience} years`);
            console.log(`Qualifications: ${doctor.qualifications.join(', ')}`);
            console.log(`Working Days: ${doctor.availability.length} days`);
            console.log(`Total Slots: ${doctor.availability.reduce((total, day) => total + day.slots.length, 0)}`);
        });

        // Availability statistics
        const availabilityStats = await Doctor.aggregate([
            { $unwind: '$availability' },
            {
                $group: {
                    _id: '$availability.day',
                    doctorCount: { $sum: 1 },
                    avgSlots: { $avg: { $size: '$availability.slots' } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n=== Availability Statistics ===');
        availabilityStats.forEach(stat => {
            console.log(`${stat._id}: ${stat.doctorCount} doctors, avg ${Math.round(stat.avgSlots)} slots`);
        });

    } catch (error) {
        console.error('Error seeding doctors:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeder
if (require.main === module) {
    seedDoctors().catch(console.error);
}

module.exports = { seedDoctors };