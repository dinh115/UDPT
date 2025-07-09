import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import chalk from 'chalk';

// Load the proto file
const PROTO_PATH = path.join(process.cwd(), 'src/proto/doctor.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const doctorProto = grpc.loadPackageDefinition(packageDefinition) as any;

// Configuration
const GRPC_HOST = 'localhost';
const GRPC_PORT = '3002'; // Assuming doctor service runs on different port
const SERVICE_TOKEN = 'service-secret-token-123';

// Create clients
const doctorClient = new doctorProto.doctor.DoctorService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());
const internalClient = new doctorProto.doctor.InternalService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());
const healthClient = new doctorProto.doctor.HealthService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());

// Test data
const testDoctors = {
    cardiologist: {
        userId: '4c0728b7-3af4-44f1-abfe-fb01c638f682',
        specialization: 'Cardiology',
        experience: 10,
        qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
        availability: [
            {
                day: 'MONDAY',
                slots: [
                    { startTime: '09:00', endTime: '09:30', isBooked: false },
                    { startTime: '09:30', endTime: '10:00', isBooked: false },
                    { startTime: '10:00', endTime: '10:30', isBooked: true },
                    { startTime: '14:00', endTime: '14:30', isBooked: false }
                ]
            },
            {
                day: 'TUESDAY',
                slots: [
                    { startTime: '09:00', endTime: '09:30', isBooked: false },
                    { startTime: '09:30', endTime: '10:00', isBooked: false }
                ]
            }
        ]
    },
    neurologist: {
        userId: '9cca5088-32dd-433b-9cf5-f793d0e826be',
        specialization: 'Neurology',
        experience: 8,
        qualifications: ['MBBS', 'MD Neurology', 'DM Neurology'],
        availability: [
            {
                day: 'WEDNESDAY',
                slots: [
                    { startTime: '11:00', endTime: '11:30', isBooked: false },
                    { startTime: '11:30', endTime: '12:00', isBooked: false },
                    { startTime: '15:00', endTime: '15:30', isBooked: false }
                ]
            },
            {
                day: 'FRIDAY',
                slots: [
                    { startTime: '10:00', endTime: '10:30', isBooked: false },
                    { startTime: '10:30', endTime: '11:00', isBooked: true }
                ]
            }
        ]
    }
};

// Global variables to store created doctor IDs
let cardiologistId = '';
let neurologistId = '';
let toBeDeletedId = '';

// Mock tokens (you would get these from user service in real scenario)
const mockTokens = {
    admin: 'mock-admin-token',
    doctor: 'mock-doctor-token',
    doctor2: 'mock-doctor2-token',
    patient: 'mock-patient-token'
};

// Utility functions
export function createMetadata(token?: string): grpc.Metadata {
    const metadata = new grpc.Metadata();

    if (token) {
        metadata.add('authorization', `Bearer ${token}`);

        // Mock metadata based on token
        switch (token) {
            case 'mock-admin-token':
                metadata.add('userId', '3e256aa4-ff5a-495d-aa88-b7c56a30aab1');
                metadata.add('email', 'admin@test.com');
                metadata.add('username', 'admin');
                metadata.add('role', 'admin');
                metadata.add('status', 'active');
                break;

            case 'mock-doctor-token':
                metadata.add('userId', '4c0728b7-3af4-44f1-abfe-fb01c638f682');
                metadata.add('email', 'doctor@example.com');
                metadata.add('username', 'doctor');
                metadata.add('role', 'doctor');
                metadata.add('status', 'active');
                break;
            case 'mock-doctor2-token':
                metadata.add('userId', '9cca5088-32dd-433b-9cf5-f793d0e826be');
                metadata.add('email', 'doctor2@example.com');
                metadata.add('username', 'doctor2');
                metadata.add('role', 'doctor');
                metadata.add('status', 'active');
                break;
            case 'mock-patient-token':
                metadata.add('userId', '12d8cbd6-5552-4885-9cb3-f36b8acbea29');
                metadata.add('email', 'patient@example.com');
                metadata.add('username', 'patient');
                metadata.add('role', 'patient');
                metadata.add('status', 'active');
                break;

            default:
                // Unknown token, can skip or add default values
                metadata.add('role', 'guest');
                metadata.add('status', 'inactive');
                break;
        }
    }

    return metadata;
}

function createServiceMetadata(): grpc.Metadata {
    const metadata = new grpc.Metadata();
    metadata.add('x-service-token', SERVICE_TOKEN);
    return metadata;
}

function promisify<TRequest, TResponse>(
    client: any,
    method: string
): (request: TRequest, metadata?: grpc.Metadata) => Promise<TResponse> {
    return (request: TRequest, metadata?: grpc.Metadata): Promise<TResponse> => {
        return new Promise((resolve, reject) => {
            client[method](request, metadata || new grpc.Metadata(), (error: grpc.ServiceError | null, response: TResponse) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    };
}

// Test functions
class DoctorGrpcTestClient {

    // =================== HEALTH SERVICE TESTS ===================
    async testHealthCheck(): Promise<void> {
        console.log(chalk.blue('\n=== Testing Doctor Health Service ==='));

        try {
            const healthCheck = promisify(healthClient, 'Check');
            const response = await healthCheck({}) as any;

            console.log(chalk.green('✓ Health Check:'), response);
        } catch (error) {
            console.log(chalk.red('✗ Health Check failed:'), error);
        }
    }

    // =================== DOCTOR SERVICE TESTS ===================
    async testDoctorService(): Promise<void> {
        console.log(chalk.blue('\n=== Testing Doctor Service ==='));

        await this.testCreateDoctorProfile();
        await this.testGetDoctors();
        await this.testGetDoctorById();
        await this.testUpdateDoctorProfile();
        await this.testUpdateDoctorAvailability();
        await this.testDeleteDoctors();
    }

    async testCreateDoctorProfile(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Create Doctor Profile ---'));

        const createProfile = promisify(doctorClient, 'CreateDoctorProfile');

        // Create cardiologist profile
        try {
            const response = await createProfile({
                userId: testDoctors.cardiologist.userId,
                specialization: testDoctors.cardiologist.specialization,
                experience: testDoctors.cardiologist.experience,
                qualifications: testDoctors.cardiologist.qualifications,
                availability: testDoctors.cardiologist.availability
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- Cardiologist Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                cardiologistId = response.doctor.id;
                console.log(chalk.green('✓ Cardiologist profile created successfully'));
                console.log('   Doctor ID:', response.doctor.id);
                console.log('   Specialization:', response.doctor.specialization);
            } else {
                console.log(chalk.red('✗ Cardiologist profile creation failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Cardiologist profile creation error:'), error);
        }

        // Create neurologist profile
        try {
            const response = await createProfile({
                userId: testDoctors.neurologist.userId,
                specialization: testDoctors.neurologist.specialization,
                experience: testDoctors.neurologist.experience,
                qualifications: testDoctors.neurologist.qualifications,
                availability: testDoctors.neurologist.availability
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- Neurologist Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                neurologistId = response.doctor.id;
                console.log(chalk.green('✓ Neurologist profile created successfully'));
            } else {
                console.log(chalk.red('✗ Neurologist profile creation failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Neurologist profile creation error:'), error);
        }

        // Test unauthorized creation (patient trying to create doctor profile)
        try {
            const response = await createProfile({
                userId: 'unauthorized_user',
                specialization: 'General Medicine',
                experience: 5,
                qualifications: ['MBBS'],
                availability: []
            }, createMetadata(mockTokens.patient)) as any;

            console.log(chalk.yellow('\n--- Unauthorized Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Unauthorized doctor profile creation properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected unauthorized doctor profile creation'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Unauthorized doctor profile creation properly rejected with error'));
        }
    }

    async testGetDoctors(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Doctors ---'));

        const getDoctors = promisify(doctorClient, 'findDoctors');

        // Test get all doctors
        try {
            const response = await getDoctors({
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- All Doctors Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get all doctors successful'));
                console.log('   Total doctors:', response.pagination.totalItems);
                console.log('   Doctors found:', response.doctors.length);
            } else {
                console.log(chalk.red('✗ Get all doctors failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get all doctors error:'), error);
        }

        // Test get doctors by specialization
        try {
            const response = await getDoctors({
                specialization: 'Cardiology',
                page: 1,
                limit: 5,
                sortBy: 'experience',
                sortOrder: 'desc'
            }, createMetadata(mockTokens.patient)) as any;

            console.log(chalk.yellow('\n--- Cardiology Doctors Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get cardiology doctors successful'));
                console.log('   Cardiology doctors found:', response.doctors.length);
            } else {
                console.log(chalk.red('✗ Get cardiology doctors failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get cardiology doctors error:'), error);
        }

        // Test pagination
        try {
            const response = await getDoctors({
                page: 1,
                limit: 1,
                sortBy: 'createdAt',
                sortOrder: 'asc'
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- Pagination Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Pagination test successful'));
                console.log('   Current page:', response.pagination.currentPage);
                console.log('   Has next:', response.pagination.hasNext);
            } else {
                console.log(chalk.red('✗ Pagination test failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Pagination test error:'), error);
        }
    }

    async testGetDoctorById(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Doctor By ID ---'));

        const getDoctorById = promisify(doctorClient, 'GetDoctorById');

        // Test valid doctor ID
        try {
            const response = await getDoctorById({
                doctorId: cardiologistId
            }, createMetadata(mockTokens.patient)) as any;

            console.log(chalk.yellow('\n--- Valid ID Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get doctor by ID successful'));
                console.log('   Doctor:', response.doctor.specialization);
                console.log('   Experience:', response.doctor.experience, 'years');
            } else {
                console.log(chalk.red('✗ Get doctor by ID failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get doctor by ID error:'), error);
        }

        // Test invalid doctor ID
        try {
            const response = await getDoctorById({
                doctorId: 'invalid-doctor-id'
            }, createMetadata(mockTokens.patient)) as any;

            console.log(chalk.yellow('\n--- Invalid ID Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Invalid doctor ID properly handled'));
            } else {
                console.log(chalk.red('✗ Should have handled invalid doctor ID'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Invalid doctor ID properly handled with error'));
        }
    }

    async testUpdateDoctorProfile(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Update Doctor Profile ---'));

        const updateProfile = promisify(doctorClient, 'UpdateDoctorProfile');

        // Test valid update by admin
        try {
            const response = await updateProfile({
                userId: testDoctors.cardiologist.userId,
                specialization: 'Interventional Cardiology',
                experience: 12,
                qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology', 'FACC'],
                availability: [
                    {
                        day: 'MONDAY',
                        slots: [
                            { startTime: '09:00', endTime: '09:30', isBooked: false },
                            { startTime: '09:30', endTime: '10:00', isBooked: false },
                            { startTime: '10:00', endTime: '10:30', isBooked: false },
                            { startTime: '14:00', endTime: '14:30', isBooked: false },
                            { startTime: '14:30', endTime: '15:00', isBooked: false }
                        ]
                    }
                ]
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- Update Profile Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Update doctor profile successful'));
                console.log('   Updated specialization:', response.doctor.specialization);
                console.log('   Updated experience:', response.doctor.experience);
            } else {
                console.log(chalk.red('✗ Update doctor profile failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update doctor profile error:'), error);
        }

        try {
            const response = await updateProfile({
                userId: testDoctors.cardiologist.userId,
                specialization: 'Interventional Cardiology',
                experience: 12,
                qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology', 'FACC'],
                availability: [
                    {
                        day: 'MONDAY',
                        slots: [
                            { startTime: '09:00', endTime: '09:30', isBooked: false },
                            { startTime: '09:30', endTime: '10:00', isBooked: false },
                            { startTime: '10:00', endTime: '10:30', isBooked: false },
                            { startTime: '14:00', endTime: '14:30', isBooked: false },
                            { startTime: '14:30', endTime: '15:00', isBooked: false }
                        ]
                    }
                ]
            }, createMetadata(mockTokens.doctor)) as any;

            console.log(chalk.yellow('\n--- Update Profile Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✗ Doctor Update doctor profile failed'));
                console.log('   Updated specialization:', response.doctor.specialization);
                console.log('   Updated experience:', response.doctor.experience);
            } else {
                console.log(chalk.green('✓ Doctor Update doctor profile success:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update doctor profile error:'), error);
        }

        // Test unauthorized update (patient trying to update doctor profile)
        try {
            const response = await updateProfile({
                userId: testDoctors.neurologist.userId,
                specialization: 'Pediatric Neurology',
                experience: 15
            }, createMetadata(mockTokens.patient)) as any;

            console.log(chalk.yellow('\n--- Unauthorized Update Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Unauthorized profile update properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected unauthorized profile update'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Unauthorized profile update properly rejected with error'));
        }
    }

    async testUpdateDoctorAvailability(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Update Doctor Availability ---'));

        const updateAvailability = promisify(doctorClient, 'UpdateDoctorAvailability');

        try {
            const newAvailability = [
                {
                    day: 'MONDAY',
                    slots: [
                        { startTime: '08:00', endTime: '08:30', isBooked: false },
                        { startTime: '08:30', endTime: '09:00', isBooked: false },
                        { startTime: '16:00', endTime: '16:30', isBooked: false }
                    ]
                },
                {
                    day: 'WEDNESDAY',
                    slots: [
                        { startTime: '10:00', endTime: '10:30', isBooked: false },
                        { startTime: '10:30', endTime: '11:00', isBooked: false }
                    ]
                }
            ];

            const response = await updateAvailability({
                userId: testDoctors.neurologist.userId,
                availability: newAvailability
            }, createMetadata(mockTokens.doctor2)) as any;

            console.log(chalk.yellow('\n--- Update Availability Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Update doctor availability successful'));
                console.log('   Available days:', response.doctor.availability.length);
            } else {
                console.log(chalk.red('✗ Update doctor availability failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update doctor availability error:'), error);
        }
    }

    async testDeleteDoctors(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Delete Doctors ---'));

        const deleteDoctors = promisify(doctorClient, 'DeleteDoctors');

        // First create a doctor to be deleted
        const createProfile = promisify(doctorClient, 'CreateDoctorProfile');
        try {
            const createResponse = await createProfile({
                userId: '03b5b3e4-82d5-410d-96fc-77662a33358e',
                specialization: 'General Medicine',
                experience: 3,
                qualifications: ['MBBS'],
                availability: [{
                    day: 'MONDAY',
                    slots: [
                        { startTime: '08:00', endTime: '08:30', isBooked: false },
                        { startTime: '08:30', endTime: '09:00', isBooked: false },
                        { startTime: '16:00', endTime: '16:30', isBooked: false }
                    ]
                }]
            }, createMetadata(mockTokens.admin)) as any;
            console.log(chalk.yellow('\n--- Create Delete Profile Response ---\n'), JSON.stringify(createResponse, null, 2));

            if (createResponse.success) {
                toBeDeletedId = createResponse.doctor.id;
                console.log(chalk.blue(' SUCCESS  Created doctor to delete:', toBeDeletedId));
            }
            else {
                console.log(chalk.red('FAILED  Created doctor to delete'));

            }
        } catch (error) {
            console.log(chalk.red('   Failed to create doctor for deletion test:'), error);
        }

        // Test authorized deletion (admin)
        try {
            const response = await deleteDoctors({
                doctorIds: [toBeDeletedId]
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- Admin Delete Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Admin delete doctors successful'));
            } else {
                console.log(chalk.red('✗ Admin delete doctors failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Admin delete doctors error:'), error);
        }

        // Test unauthorized deletion (patient)
        try {
            const response = await deleteDoctors({
                doctorIds: [cardiologistId]
            }, createMetadata(mockTokens.patient)) as any;

            console.log(chalk.yellow('\n--- Patient Delete Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Unauthorized deletion properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected unauthorized deletion'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Unauthorized deletion properly rejected with error'));
        }

        // Test delete non-existent doctor
        try {
            const response = await deleteDoctors({
                doctorIds: ['non-existent-doctor-id']
            }, createMetadata(mockTokens.admin)) as any;

            console.log(chalk.yellow('\n--- Delete Non-existent Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Delete non-existent doctor properly handled'));
            } else {
                console.log(chalk.yellow('? Delete non-existent doctor response:', response.message));
            }
        } catch (error) {
            console.log(chalk.red('✗ Delete non-existent doctor error:'), error);
        }
    }

    // =================== INTERNAL SERVICE TESTS ===================
    async testInternalService(): Promise<void> {
        console.log(chalk.blue('\n=== Testing Internal Service ==='));

        await this.testGetDoctorInternal();
        await this.testGetDoctorsInternal();
        await this.testBatchGetDoctors();
        await this.testGetAvailableTimeSlots();
        await this.testGenerateTimeSlots();
        await this.testGetDoctorSlotStatistics();
        await this.testBookingDoctorSlot();
    }

    async testGetDoctorInternal(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Doctor Internal ---'));

        const getDoctorInternal = promisify(internalClient, 'GetDoctorByIdInternal');

        // Test with service token
        try {
            const response = await getDoctorInternal({
                doctorId: cardiologistId
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Internal Get Doctor Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get doctor internal successful'));
                console.log('   Doctor:', response.doctor.specialization);
            } else {
                console.log(chalk.red('✗ Get doctor internal failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get doctor internal error:'), error);
        }

        // Test without service token
        try {
            const response = await getDoctorInternal({
                doctorId: cardiologistId
            }) as any;

            console.log(chalk.yellow('\n--- No Service Token Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Service authentication properly enforced'));
            } else {
                console.log(chalk.red('✗ Should have rejected request without service token'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Service authentication properly enforced with error'));
        }
    }

    async testGetDoctorsInternal(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Doctors Internal ---'));

        const getDoctorsInternal = promisify(internalClient, 'GetDoctorsInternal');

        try {
            const response = await getDoctorsInternal({
                page: 1,
                limit: 5,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Internal Get Doctors Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get doctors internal successful'));
                console.log('   Doctors retrieved:', response.doctors.length);
            } else {
                console.log(chalk.red('✗ Get doctors internal failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get doctors internal error:'), error);
        }
    }

    async testBatchGetDoctors(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Batch Get Doctors ---'));

        const batchGetDoctors = promisify(internalClient, 'BatchGetDoctors');

        try {
            const response = await batchGetDoctors({
                doctorIds: [cardiologistId, neurologistId]
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Batch Get Doctors Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Batch get doctors successful'));
                console.log('   Doctors retrieved:', response.doctors.length);
            } else {
                console.log(chalk.red('✗ Batch get doctors failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Batch get doctors error:'), error);
        }
    }

    async testGetAvailableTimeSlots(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Available Time Slots ---'));

        const getAvailableSlots = promisify(internalClient, 'GetAvailableTimeSlots');

        try {
            const response = await getAvailableSlots({
                doctorId: cardiologistId,
                date: '2025-08-25' // MONDAY
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Available Slots Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get available time slots successful'));
                console.log('   Available slots:', response.slots.length);
            } else {
                console.log(chalk.red('✗ Get available time slots failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get available time slots error:'), error);
        }

        // Test for a day with no availability
        try {
            const response = await getAvailableSlots({
                doctorId: cardiologistId,
                date: '2025-08-02' // SUNDAY (no availability)
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- No Availability Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success && response.slots.length === 0) {
                console.log(chalk.green('✓ No available slots properly handled'));
            } else {
                console.log(chalk.yellow('? Unexpected response for no availability'));
            }
        } catch (error) {
            console.log(chalk.green('✓ No available slots properly handled via error:'), error);
        }
    }

    async testGenerateTimeSlots(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Generate Time Slots ---'));

        const generateSlots = promisify(internalClient, 'GenerateTimeSlots');

        try {
            const response = await generateSlots({
                startTime: '09:00',
                endTime: '17:00',
                gap: 30 // 30-minute slots
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Generate Slots Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Generate time slots successful'));
                console.log('   Total slots generated:', response.data.totalSlots);
                console.log('   First slot:', response.data.slots[0]);
                console.log('   Last slot:', response.data.slots[response.data.slots.length - 1]);
            } else {
                console.log(chalk.red('✗ Generate time slots failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Generate time slots error:'), error);
        }

        // Test with invalid time range
        try {
            const response = await generateSlots({
                startTime: '17:00',
                endTime: '09:00', // End before start
                gap: 30
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Invalid Time Range Response ---\n'), JSON.stringify(response, null, 2));

            if (!response.success) {
                console.log(chalk.green('✓ Invalid time range properly handled'));
            } else {
                console.log(chalk.red('✗ Should have handled invalid time range'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Invalid time range properly handled with error'));
        }
    }

    async testGetDoctorSlotStatistics(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Doctor Slot Statistics ---'));

        const getSlotStats = promisify(internalClient, 'GetDoctorSlotStatistics');

        // Test daily statistics
        try {
            const response = await getSlotStats({
                doctorId: cardiologistId,
                date: '2025-08-25' // MONDAY
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Daily Stats Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get daily slot statistics successful'));
                if (response.dailyStats) {
                    console.log('   Date:', response.dailyStats.date);
                    console.log('   Total slots:', response.dailyStats.totalSlots);
                    console.log('   Available slots:', response.dailyStats.availableSlots);
                    console.log('   Booked slots:', response.dailyStats.bookedSlots);
                }
            } else {
                console.log(chalk.red('✗ Get daily slot statistics failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get daily slot statistics error:'), error);
        }

        // Test weekly statistics (without date parameter)
        try {
            const response = await getSlotStats({
                doctorId: cardiologistId
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Weekly Stats Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Get weekly slot statistics successful'));
                if (response.weeklyStats) {
                    console.log('   Weekly stats count:', response.weeklyStats.weekly.length);
                    console.log('   Overall total slots:', response.weeklyStats.overall.totalSlots);
                }
            } else {
                console.log(chalk.red('✗ Get weekly slot statistics failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get weekly slot statistics error:'), error);
        }
    }

    async testBookingDoctorSlot() {
        console.log(chalk.yellow('\n--- Testing Booking Doctor Slot ---'));

        const bookSlot = promisify(internalClient, 'UpdateBooking');
        try {
            const response = await bookSlot({
                doctorId: cardiologistId,
                appointmentDate: '2025-08-25', // MONDAY
                timeSlot: {
                    startTime: '09:00',
                    endTime: '09:30'
                },
                isBooked: true
            }, createServiceMetadata()) as any;

            console.log(chalk.yellow('\n--- Booking Slot Response ---\n'), JSON.stringify(response, null, 2));

            if (response.success) {
                console.log(chalk.green('✓ Booking doctor slot successful'));
                console.log('   Slot booked for patient:', response.booking.timeSlot);
            } else {
                console.log(chalk.red('✗ Booking doctor slot failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Booking doctor slot error:'), error);
        }
    }

    // =================== RUN ALL TESTS ===================
    async runAllTests(): Promise<void> {
        console.log(chalk.magenta('🚀 Starting gRPC Service Tests\n'));

        await this.testHealthCheck();
        await this.testDoctorService();
        await this.testInternalService();

        console.log(chalk.magenta('\n✅ All tests completed!'));
    }
}

// =================== MAIN EXECUTION ===================
async function main() {
    const testClient = new DoctorGrpcTestClient();

    try {
        await testClient.runAllTests();
    } catch (error) {
        console.error(chalk.red('Test execution failed:'), error);
    } finally {
        // Close gRPC clients
        doctorClient.close();
        internalClient.close();
        healthClient.close();

        console.log(chalk.green('\n🔌 gRPC clients closed'));
        process.exit(0);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Test client shutting down...'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n🛑 Test client shutting down...'));
    process.exit(0);
});

// Run the tests
if (require.main === module) {
    main().catch(console.error);
}

export default DoctorGrpcTestClient;