// mongo-init.js
// This script runs when MongoDB container starts for the first time

// Switch to the doctor management database
db = db.getSiblingDB('doctor-management');

// Create a user for the application
db.createUser({
    user: 'doctorapp',
    pwd: 'doctorapppassword',
    roles: [
        {
            role: 'readWrite',
            db: 'doctor-management'
        }
    ]
});

// Create indexes for doctors collection (adjust based on your Doctor model)
db.doctors.createIndex({ "userId": 1 }, { unique: true });
db.doctors.createIndex({ "specialization": 1 });
db.doctors.createIndex({ "specialization": 1, "availability.day": 1 });

// Create test database and user
db = db.getSiblingDB('doctor-management-test');

db.createUser({
    user: 'testdoctor',
    pwd: 'testpassword',
    roles: [
        {
            role: 'readWrite',
            db: 'doctor-management-test'
        }
    ]
});

print('Doctor service MongoDB initialization completed successfully!');