// mongo-init.js
// This script runs when MongoDB container starts for the first time

// Switch to the user management database
db = db.getSiblingDB('user-management');

// Create a user for the application
db.createUser({
    user: 'admin',
    pwd: 'admin',
    roles: [
        {
            role: 'readWrite',
            db: 'user-management'
        }
    ]
});

db.users.insertMany([
    {
        _id: 'cb427d67-15ce-4eb8-9c6d-5d622db27106',
        email: 'admin@test.com',
        username: 'admin_test',
        phone: '+1234567890',
        address: '123 Admin Street, Admin City, AC 12345',
        dateOfBirth: new Date('1985-06-15T00:00:00.000Z'),
        password: '$2a$12$3NPmt0x2hCplSoYO2bSBM.E3qTvh78YUn48OvxlsAwlxGIzMeTpKy', // bcrypt hash for 'password'
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2025-07-04T15:55:45.303Z'),
        updatedAt: new Date('2025-07-04T16:10:53.544Z')
    },
    {
        _id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        email: 'admin2@test.com',
        username: 'admin_second',
        phone: '+1987654321',
        address: '456 Admin Lane, Admin Town, AT 67890',
        dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
        password: '$2a$12$3NPmt0x2hCplSoYO2bSBM.E3qTvh78YUn48OvxlsAwlxGIzMeTpKy', // bcrypt hash for 'password'
        firstName: 'Second',
        lastName: 'Admin',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

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