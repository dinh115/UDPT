// mongo-init.js
// This script runs when MongoDB container starts for the first time

// Switch to the user management database
db = db.getSiblingDB('user-management');

// Create a user for the application
db.createUser({
    user: 'userapp',
    pwd: 'userapppassword',
    roles: [
        {
            role: 'readWrite',
            db: 'user-management'
        }
    ]
});

// Create indexes for better performance (matching your User.ts model)
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 });
db.users.createIndex({ "status": 1 });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "createdAt": -1 });
db.users.createIndex({ "dateOfBirth": 1 });

// Compound indexes (matching your User.ts model)
db.users.createIndex({ "status": 1, "role": 1 });
db.users.createIndex({ "role": 1, "createdAt": -1 });

// Create test database and user
db = db.getSiblingDB('user-management-test');

db.createUser({
    user: 'testuser',
    pwd: 'testpassword',
    roles: [
        {
            role: 'readWrite',
            db: 'user-management-test'
        }
    ]
});

print('MongoDB initialization completed successfully!');