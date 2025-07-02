// mongo-init.js
// This script runs when MongoDB container starts for the first time

// Switch to the appointment management database
db = db.getSiblingDB('appointment-management');

// Create a user for the application
db.createUser({
    user: 'appointmentapp',
    pwd: 'appointmentapppassword',
    roles: [
        {
            role: 'readWrite',
            db: 'appointment-management'
        }
    ]
});

// Create indexes for appointments collection based on the Appointment model
// Compound index to prevent double booking for confirmed appointments
db.appointments.createIndex(
    {
        "doctorId": 1,
        "appointmentDate": 1,
        "timeSlot.startTime": 1
    },
    {
        unique: true,
        partialFilterExpression: {
            "status": { $in: ["CONFIRMED", "COMPLETED"] }
        },
        name: "unique_doctor_appointment_slot"
    }
);

// Index for better query performance - patient appointments
db.appointments.createIndex(
    { "patientId": 1, "appointmentDate": -1 },
    { name: "patient_appointments_by_date" }
);

// Index for better query performance - doctor appointments
db.appointments.createIndex(
    { "doctorId": 1, "appointmentDate": 1 },
    { name: "doctor_appointments_by_date" }
);

// Index for status-based queries
db.appointments.createIndex(
    { "status": 1 },
    { name: "appointments_by_status" }
);

// Additional composite indexes for common queries
db.appointments.createIndex(
    { "doctorId": 1, "status": 1, "appointmentDate": 1 },
    { name: "doctor_status_date" }
);

db.appointments.createIndex(
    { "patientId": 1, "status": 1 },
    { name: "patient_status" }
);

// Create test database and user
db = db.getSiblingDB('appointment-management-test');

db.createUser({
    user: 'testappointment',
    pwd: 'testpassword',
    roles: [
        {
            role: 'readWrite',
            db: 'appointment-management-test'
        }
    ]
});

// Create the same indexes for test database
db.appointments.createIndex(
    {
        "doctorId": 1,
        "appointmentDate": 1,
        "timeSlot.startTime": 1
    },
    {
        unique: true,
        partialFilterExpression: {
            "status": { $in: ["CONFIRMED", "COMPLETED"] }
        },
        name: "unique_doctor_appointment_slot"
    }
);

db.appointments.createIndex(
    { "patientId": 1, "appointmentDate": -1 },
    { name: "patient_appointments_by_date" }
);

db.appointments.createIndex(
    { "doctorId": 1, "appointmentDate": 1 },
    { name: "doctor_appointments_by_date" }
);

db.appointments.createIndex(
    { "status": 1 },
    { name: "appointments_by_status" }
);

db.appointments.createIndex(
    { "doctorId": 1, "status": 1, "appointmentDate": 1 },
    { name: "doctor_status_date" }
);

db.appointments.createIndex(
    { "patientId": 1, "status": 1 },
    { name: "patient_status" }
);

print('Appointment service MongoDB initialization completed successfully!');