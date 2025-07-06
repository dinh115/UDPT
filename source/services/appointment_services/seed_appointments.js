/***
 * TO RUN THIS FILE: node seed-appointments.js
 */

const mongoose = require('mongoose');
const { v4: uuidv4, v5: uuidv5, validate: isUUID } = require('uuid');

// Same namespace from your models
const DOCTOR_NAMESPACE = '3f96061a-3a25-4f89-9ae9-abc012345678';
const USER_NAMESPACE = '3f96061a-3a25-4f89-9ae9-abc012345678';

// Appointment Status enum
const AppointmentStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
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
    }
}, { _id: false });

// Appointment schema
const appointmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    patientId: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return isUUID(v);
            },
            message: 'Patient ID must be a valid UUID',
        },
    },
    doctorId: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return isUUID(v);
            },
            message: 'Doctor ID must be a valid UUID',
        },
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: timeSlotSchema,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.PENDING
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    }
}, {
    timestamps: true,
    _id: false
});

// Compound index to prevent double booking
appointmentSchema.index({
    doctorId: 1,
    appointmentDate: 1,
    'timeSlot.startTime': 1
}, {
    unique: true,
    partialFilterExpression: {
        status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED] }
    }
});

// Index for better query performance
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Common time slots for appointments
const timeSlots = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' }
];

// Sample appointment notes
const appointmentNotes = [
    'Regular checkup',
    'Follow-up appointment',
    'Consultation for symptoms',
    'Routine examination',
    'Health screening',
    'Medication review',
    'Preventive care visit',
    'Discuss test results',
    'Annual physical',
    'Specialist consultation',
    'Emergency consultation',
    'Second opinion requested',
    'Post-surgery follow-up',
    'Vaccination appointment',
    'Lab results discussion'
];

// Generate random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate random time slot
function generateTimeSlot() {
    const slot = randomElement(timeSlots);
    return {
        _id: uuidv4(),
        startTime: slot.start,
        endTime: slot.end
    };
}

// Generate random appointment date
function generateAppointmentDate(status) {
    const now = new Date();

    if (status === AppointmentStatus.COMPLETED) {
        // Past appointments (1-60 days ago)
        const daysAgo = Math.floor(Math.random() * 60) + 1;
        return new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    } else {
        // Future appointments (1-90 days from now)
        const daysFromNow = Math.floor(Math.random() * 90) + 1;
        return new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    }
}

// Generate random appointment status
function generateAppointmentStatus() {
    const statuses = Object.values(AppointmentStatus);
    // Weight distribution: more confirmed and pending appointments
    const weightedStatuses = [
        ...Array(4).fill(AppointmentStatus.CONFIRMED),
        ...Array(3).fill(AppointmentStatus.PENDING),
        ...Array(2).fill(AppointmentStatus.COMPLETED),
        ...Array(1).fill(AppointmentStatus.CANCELLED)
    ];
    return randomElement(weightedStatuses);
}

// Generate random appointment notes
function generateAppointmentNotes() {
    // 20% chance of no notes
    if (Math.random() < 0.2) {
        return null;
    }
    return randomElement(appointmentNotes);
}

// Get patient user IDs from user service
async function getPatientUserIds() {
    try {
        const userMongoUri = 'mongodb://admin:adminpassword@localhost:27017/user-management?authSource=admin';
        const userConnection = await mongoose.createConnection(userMongoUri);

        const UserSchema = new mongoose.Schema({
            _id: String,
            role: String
        });

        const User = userConnection.model('User', UserSchema);
        const patientUsers = await User.find({ role: 'patient' }).select('_id');

        await userConnection.close();

        return patientUsers.map(user => user._id);
    } catch (error) {
        console.error('Error fetching patient user IDs:', error);
        throw error;
    }
}

// Get doctor IDs from doctor service
async function getDoctorIds() {
    try {
        const doctorMongoUri = 'mongodb://admin:adminpassword@localhost:27018/doctor-management?authSource=admin';
        const doctorConnection = await mongoose.createConnection(doctorMongoUri);

        const DoctorSchema = new mongoose.Schema({
            _id: String,
            specialization: String
        });

        const Doctor = doctorConnection.model('Doctor', DoctorSchema);
        const doctors = await Doctor.find().select('_id specialization');

        await doctorConnection.close();

        return doctors;
    } catch (error) {
        console.error('Error fetching doctor IDs:', error);
        throw error;
    }
}

// Generate appointment data
function generateAppointment(patientId, doctorId) {
    const status = generateAppointmentStatus();
    const appointmentDate = generateAppointmentDate(status);
    const timeSlot = generateTimeSlot();
    const notes = generateAppointmentNotes();

    return {
        _id: uuidv4(),
        patientId: patientId,
        doctorId: doctorId,
        appointmentDate: appointmentDate,
        timeSlot: timeSlot,
        status: status,
        notes: notes
    };
}

// Main seeding function
async function seedAppointments() {
    try {
        // Connect to appointment service database
        const appointmentMongoUri = 'mongodb://admin:adminpassword@localhost:27019/appointment-management?authSource=admin';
        await mongoose.connect(appointmentMongoUri);
        console.log('Connected to Appointment MongoDB');

        // Clear existing appointments
        await Appointment.deleteMany({});
        console.log('Cleared existing appointments');

        // Get patient user IDs from user service
        console.log('Fetching patient user IDs from user service...');
        const patientUserIds = await getPatientUserIds();
        console.log(`Found ${patientUserIds.length} patient users`);

        if (patientUserIds.length === 0) {
            console.log('No patient users found. Please seed the user service first.');
            return;
        }

        // Get doctor IDs from doctor service
        console.log('Fetching doctor IDs from doctor service...');
        const doctors = await getDoctorIds();
        console.log(`Found ${doctors.length} doctors`);

        if (doctors.length === 0) {
            console.log('No doctors found. Please seed the doctor service first.');
            return;
        }

        // Generate appointments
        const appointmentsToCreate = Math.min(1000, patientUserIds.length * 3); // Max 3 appointments per patient
        console.log(`Generating ${appointmentsToCreate} appointments...`);

        const appointments = [];
        for (let i = 0; i < appointmentsToCreate; i++) {
            const patientId = randomElement(patientUserIds);
            const doctor = randomElement(doctors);
            const appointment = generateAppointment(patientId, doctor._id);
            appointments.push(appointment);
        }

        // Insert appointments in batches to handle potential conflicts
        const batchSize = 50;
        let inserted = 0;
        let skipped = 0;

        for (let i = 0; i < appointments.length; i += batchSize) {
            const batch = appointments.slice(i, i + batchSize);

            try {
                await Appointment.insertMany(batch, { ordered: false });
                inserted += batch.length;
                console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(appointments.length / batchSize)} (${batch.length} appointments)`);
            } catch (error) {
                // Handle duplicate key errors (double booking conflicts)
                if (error.code === 11000) {
                    const successfulInserts = batch.length - (error.writeErrors?.length || 0);
                    inserted += successfulInserts;
                    skipped += (error.writeErrors?.length || 0);
                    console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${successfulInserts} inserted, ${error.writeErrors?.length || 0} skipped (conflicts)`);
                } else {
                    throw error;
                }
            }
        }

        // Display statistics
        const statusStats = await Appointment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        console.log('\n=== Seeding Complete ===');
        console.log('Appointment distribution by status:');
        statusStats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} appointments`);
        });

        const totalAppointments = await Appointment.countDocuments();
        console.log(`\nTotal appointments created: ${totalAppointments}`);
        console.log(`Skipped (conflicts): ${skipped}`);
        console.log(`Patients used: ${patientUserIds.length}`);
        console.log(`Doctors used: ${doctors.length}`);

        // Sample appointments for verification
        console.log('\n=== Sample Appointments ===');
        const sampleAppointments = await Appointment.find().limit(3);

        sampleAppointments.forEach((appointment, index) => {
            console.log(`\nSample Appointment ${index + 1}:`);
            console.log(`ID: ${appointment._id}`);
            console.log(`Patient ID: ${appointment.patientId}`);
            console.log(`Doctor ID: ${appointment.doctorId}`);
            console.log(`Date: ${appointment.appointmentDate.toISOString().split('T')[0]}`);
            console.log(`Time: ${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}`);
            console.log(`Status: ${appointment.status}`);
            console.log(`Notes: ${appointment.notes || 'None'}`);
        });

        // Monthly distribution statistics
        const monthlyStats = await Appointment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$appointmentDate' },
                        month: { $month: '$appointmentDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        console.log('\n=== Monthly Distribution ===');
        monthlyStats.forEach(stat => {
            const monthName = new Date(stat._id.year, stat._id.month - 1).toLocaleString('default', { month: 'long' });
            console.log(`${monthName} ${stat._id.year}: ${stat.count} appointments`);
        });

    } catch (error) {
        console.error('Error seeding appointments:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeder
if (require.main === module) {
    seedAppointments().catch(console.error);
}
