import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import chalk from 'chalk';
import * as Responses from '@/proto/generated/user'
import { roles } from '../types';

// Load the proto file
const PROTO_PATH = path.join(process.cwd(), 'src/proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

// Configuration
const GRPC_HOST = 'localhost';
const GRPC_PORT = '50051';
const SERVICE_TOKEN = 'service-secret-token-123'; // Replace with your actual service token

// Create clients
const authClient = new userProto.user.AuthService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());
const userClient = new userProto.user.UserService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());
const internalClient = new userProto.user.InternalService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());
const healthClient = new userProto.user.HealthService(`${GRPC_HOST}:${GRPC_PORT}`, grpc.credentials.createInsecure());

export function dateToProtoTimestamp(date: Date) {
    const seconds = Math.floor(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1e6;
    return { seconds, nanos };
}

export function protoTimestampToDate(timestamp: { seconds: number | string; nanos: number }) {
    const millis = Number(timestamp.seconds) * 1000 + Math.floor(timestamp.nanos / 1e6);
    return new Date(millis);
}

// Test data
const testUsers = {
    admin: {
        username: 'admin_test',
        password: 'Admin123!',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        address: '123 Admin Street, Admin City, AC 12345',
        dateOfBirth: new Date('1985-06-15')
    },
    patient: {
        username: 'patient_test',
        password: 'Patient123!',
        email: 'patient@test.com',
        firstName: 'Patient',
        lastName: 'User',
        phone: '+1987654321',
        address: '456 Patient Avenue, Patient Town, PT 67890',
        dateOfBirth: new Date('1990-03-22')
    }
};

// Global variables to store tokens and user IDs
let adminToken = '';
let patientToken = '';
let adminUserId = '';
let patientUserId = '';
let toBeDeletedId = '';
// Utility functions
function createMetadata(token?: string): grpc.Metadata {
    const metadata = new grpc.Metadata();
    if (token) {
        metadata.add('authorization', `Bearer ${token}`);
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
class GrpcTestClient {

    // =================== HEALTH SERVICE TESTS ===================
    async testHealthCheck(): Promise<void> {
        console.log(chalk.blue('\n=== Testing Health Service ==='));

        try {
            const healthCheck = promisify(healthClient, 'Check');
            const response = await healthCheck({});

            console.log(chalk.green('✓ Health Check:'), response);
        } catch (error) {
            console.log(chalk.red('✗ Health Check failed:'), error);
        }
    }

    // =================== AUTH SERVICE TESTS ===================
    async testAuthService(): Promise<void> {
        console.log(chalk.blue('\n=== Testing Auth Service ==='));

        // Test Login
        await this.testLoginAdmin();
        await this.testLoginPatient();

        // Test Token Verification
        await this.testVerifyToken(adminToken);

        // Test Get Profile
        await this.testGetProfile();

        // Test Update Profile
        await this.testUpdateProfile();

        // Test Logout
        await this.testLogoutAdmin();
        await this.testLogoutPatient();
    }

    async testRegister(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Registration ---'));

        const register = promisify(authClient, 'Register');

        // Register admin user
        try {
            const adminResponse = await register({
                email: testUsers.admin.email,
                username: testUsers.admin.username,
                password: testUsers.admin.password,
                firstName: testUsers.admin.firstName,
                lastName: testUsers.admin.lastName,
                phone: testUsers.admin.phone,
                address: testUsers.admin.address,
                dateOfBirth: dateToProtoTimestamp(testUsers.admin.dateOfBirth)
            }) as Responses.RegisterResponse;

            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(adminResponse)));

            if (adminResponse.success) {
                adminToken = adminResponse.token!;
                adminUserId = adminResponse.user!.id;
                console.log(chalk.green('✓ Admin registration successful'));
            } else {
                console.log(chalk.red('✗ Admin registration failed:'), adminResponse.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Admin registration error:'), error);
        }

        // Register patient user
        try {
            const patientResponse = await register({
                email: testUsers.patient.email,
                username: testUsers.patient.username,
                password: testUsers.patient.password,
                firstName: testUsers.patient.firstName,
                lastName: testUsers.patient.lastName,
                phone: testUsers.patient.phone,
                address: testUsers.patient.address,
                dateOfBirth: dateToProtoTimestamp(testUsers.admin.dateOfBirth)
            }) as Responses.RegisterResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(patientResponse)));

            if (patientResponse.success) {
                patientToken = patientResponse.token;
                patientUserId = patientResponse.user!.id;
                console.log(chalk.green('✓ Patient registration successful'));
            } else {
                console.log(chalk.red('✗ Patient registration failed:'), patientResponse.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Patient registration error:'), error);
        }
    }

    async testLoginAdmin(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Login Admin ---'));

        const login = promisify(authClient, 'Login');

        try {
            const response = await login({
                username: testUsers.admin.username,
                password: testUsers.admin.password,
            }) as Responses.LoginResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));
            if (response.success) {
                adminToken = response.token;
                adminUserId = response.user!.id;

                console.log(chalk.green('✓ Login successful'));
            } else {
                console.log(chalk.red('✗ Login failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Login error:'), error);
        }

        // Test invalid credentials
        try {
            const response = await login({
                username: testUsers.admin.username,
                password: 'wrongpassword'
            }) as Responses.LoginResponse;
            console.log(chalk.yellow('\n--- Fail Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Invalid credentials properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected invalid credentials'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Invalid credentials properly rejected with error'));
        }
    }

    async testLoginPatient(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Login Patient ---'));

        const login = promisify(authClient, 'Login');

        try {
            const response = await login({
                username: testUsers.patient.username,
                password: testUsers.patient.password,
            }) as Responses.LoginResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));
            if (response.success) {
                patientToken = response.token;
                patientUserId = response.user!.id;
                console.log(chalk.green('✓ Login successful'));
            } else {
                console.log(chalk.red('✗ Login failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Login error:'), error);
        }
    }

    async testVerifyToken(token: any): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Token Verification ---'));

        const verifyToken = promisify(authClient, 'VerifyToken');

        try {
            const response = await verifyToken({ token: token }) as Responses.VerifyTokenResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Token verification successful'));
                console.log('   User ID:', response.userId);
                console.log('   Username:', response.username);
                console.log('   Role:', response.role);
            } else {
                console.log(chalk.red('✗ Token verification failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Token verification error:'), error);
        }

        // Test invalid token
        try {
            const response = await verifyToken({ token: 'invalid-token' }) as Responses.VerifyTokenResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Invalid token properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected invalid token'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Invalid token properly rejected with error'));
        }
    }

    async testGetProfile(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Profile ---'));

        const getProfile = promisify(authClient, 'GetProfile');

        try {
            const response = await getProfile({}, createMetadata(adminToken)) as Responses.GetUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Get profile successful'));
                console.log('   User:', response.user!.username);
                console.log('   Email:', response.user!.email);
            } else {
                console.log(chalk.red('✗ Get profile failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get profile error:'), error);
        }

        // Test without token
        try {
            const response = await getProfile({}) as Responses.GetUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Unauthorized access properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected unauthorized access'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Unauthorized access properly rejected with error'));
        }
    }

    async testUpdateProfile(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Patient Updates Profile ---'));

        const updateProfile = promisify(authClient, 'UpdateProfile');

        try {
            const response = await updateProfile({
                //id: patientUserId,
                firstName: 'Updated Patient',
                lastName: 'Updated User'
            }, createMetadata(patientToken)) as Responses.UpdateUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Update profile successful'));
                console.log('   Updated name:', response.user!.firstName, response.user!.lastName);
            } else {
                console.log(chalk.red('✗ Update profile failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update profile error:'), error);
        }

        try {
            const response = await updateProfile({
                //id: patientUserId,
                role: 'admin'
            }, createMetadata(patientToken)) as Responses.UpdateUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Update profile successful'));
                console.log('   Updated name:', response.user!.firstName, response.user!.lastName);
            } else {
                console.log(chalk.red('✗ Update profile failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update profile error:'), error);
        }
    }

    async testLogoutAdmin(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Logout Admin ---'));

        const logout = promisify(authClient, 'Logout');

        try {
            const response = await logout({}, createMetadata(adminToken)) as Responses.ApiResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Logout successful'));
            } else {
                console.log(chalk.red('✗ Logout failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Logout error:'), error);
        }
    }

    async testLogoutPatient(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Logout Patient ---'));

        const logout = promisify(authClient, 'Logout');

        try {
            const response = await logout({}, createMetadata(patientToken)) as Responses.ApiResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Logout successful'));
            } else {
                console.log(chalk.red('✗ Logout failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Logout error:'), error);
        }
    }

    // =================== USER SERVICE TESTS ===================
    async testUserService(): Promise<void> {
        console.log(chalk.blue('\n=== Testing User Service ==='));
        await this.testLoginAdmin();
        await this.testLoginPatient();
        await this.testGetUser();
        await this.testGetUsers();
        await this.testCreateUser();
        await this.testUpdateUser();
        await this.testDeleteUser();
    }

    async testGetUser(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get User ---'));

        const getUser = promisify(userClient, 'GetUser');
        console.log(chalk.blue(adminUserId));
        try {
            const response = await getUser({ id: adminUserId }, createMetadata(adminToken)) as Responses.GetUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Get user successful'));
                console.log('   User:', response.user!.username);
            } else {
                console.log(chalk.red('✗ Get user failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get user error:'), error);
        }

        // Test unauthorized access (patient trying to access admin)
        try {
            const response = await getUser({ id: adminUserId }, createMetadata(patientToken)) as Responses.GetUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Unauthorized access properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected unauthorized access'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Unauthorized access properly rejected with error'));
        }
    }

    async testGetUsers(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get Users ---'));

        const getUsers = promisify(userClient, 'GetUsers');

        try {
            const response = await getUsers({
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            }, createMetadata(adminToken)) as Responses.GetUsersResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Get users successful'));
                console.log('   Total users:', response.pagination!.totalItems);
                console.log('   Users found:', response.users.length);
            } else {
                console.log(chalk.red('✗ Get users failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get users error:'), error);
        }
    }

    async testCreateUser(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Create User ---'));

        const createUser = promisify(userClient, 'CreateUser');

        try {
            const response = await createUser({
                email: 'newuser@test.com',
                username: 'newuser',
                password: 'NewUser123!',
                firstName: 'New',
                lastName: 'User',
                role: 'employee',
                status: 'active',
                phone: '+1234567890',
                address: 'New User Street',
                dateOfBirth: new Date('2000-01-01')
            }, createMetadata(adminToken)) as Responses.CreateUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                toBeDeletedId = response.user!.id;
                console.log(chalk.green('✓ Create user successful'));
                console.log('   Created user:', response.user!.username);
            } else {
                console.log(chalk.red('✗ Create user failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Create user error:'), error);
        }

        // Test unauthorized creation (patient trying to create user)
        try {
            const response = await createUser({
                email: 'unauthorized@test.com',
                username: 'unauthorized',
                password: 'Unauth123!',
                firstName: 'Unauth',
                lastName: 'User',
                role: 'patient',
                status: 'active',
                phone: '+1234567890',
                address: 'New User Street',
                dateOfBirth: new Date('2000-01-01')
            }, createMetadata(patientToken)) as Responses.CreateUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Unauthorized user creation properly rejected'));
            } else {
                console.log(chalk.red('✗ Should have rejected unauthorized user creation'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Unauthorized user creation properly rejected with error'));
        }
    }

    async testUpdateUser(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Update User ---'));

        const updateUser = promisify(userClient, 'UpdateUser');

        try {
            const response = await updateUser({
                id: patientUserId,
                status: 'active',
                role: 'employee'
            }, createMetadata(adminToken)) as Responses.UpdateUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Update user successful'));
                console.log('   Updated user:', response.user!.firstName, response.user!.lastName);
            } else {
                console.log(chalk.red('✗ Update user failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update user error:'), error);
        }
        try {
            // await this.testLoginPatient();
            // await this.testVerifyToken(patientToken);
            const response = await updateUser({
                id: adminUserId,
                firstName: 'Updated Customer',
                lastName: 'Updated Name',
                role: 'admin',
                status: 'inactive'
            }, createMetadata(patientToken)) as Responses.UpdateUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));
            if (response.success) {
                console.log(chalk.green('✓ Update user successful'));
                console.log('   Updated user:', response.user!.firstName, response.user!.lastName);
            } else {
                console.log(chalk.red('✗ Update user failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Update user error:'), error);
        }
    }

    async testDeleteUser(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Delete User (Placeholder) ---'));

        const deleteUsers = promisify(userClient, 'DeleteUsers');
        try {
            const response = await deleteUsers({ userIds: [toBeDeletedId] }, createMetadata(adminToken)) as Responses.BatchDeleteUsersResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Admin Delete user properly handled'));
            } else {
                console.log(chalk.yellow('? Delete user response:', response.error));
            }
        } catch (error) {
            console.log(chalk.red('✗ Delete user error:'), error);
        }
        try {
            const response = await deleteUsers({ userIds: [adminUserId] }, createMetadata(patientToken)) as Responses.BatchDeleteUsersResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Patient Delete user properly handled'));
            } else {
                console.log(chalk.yellow('? Delete user response:', response.message));
            }
        } catch (error) {
            console.log(chalk.red('✗ Delete user error:'), error);
        }
        try {
            const response = await deleteUsers({ userIds: ['non-existent-id'] }, createMetadata(adminToken)) as Responses.BatchDeleteUsersResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Delete non-existent user properly handled'));
            } else {
                console.log(chalk.yellow('? Delete user response:', response.message));
            }
        } catch (error) {
            console.log(chalk.red('✗ Delete user error:'), error);
        }
    }

    // =================== INTERNAL SERVICE TESTS ===================
    async testInternalService(): Promise<void> {
        console.log(chalk.blue('\n=== Testing Internal Service ==='));

        await this.testGetUserInternal();
        await this.testBatchGetUsers();
        await this.testCheckUserStatus();
        await this.testVerifyUsers();
    }

    async testGetUserInternal(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Get User Internal ---'));

        const getUserInternal = promisify(internalClient, 'GetUserInternal');

        try {
            const response = await getUserInternal({ id: adminUserId }, createServiceMetadata()) as Responses.GetUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Get user internal successful'));
                console.log('   User:', response.user!.username);
            } else {
                console.log(chalk.red('✗ Get user internal failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Get user internal error:'), error);
        }

        // Test without service token
        try {
            const response = await getUserInternal({ id: adminUserId }) as Responses.GetUserResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (!response.success) {
                console.log(chalk.green('✓ Service authentication properly enforced'));
            } else {
                console.log(chalk.red('✗ Should have rejected request without service token'));
            }
        } catch (error) {
            console.log(chalk.green('✓ Service authentication properly enforced with error'));
        }
    }

    async testBatchGetUsers(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Batch Get Users ---'));

        const batchGetUsers = promisify(internalClient, 'BatchGetUsers');

        try {
            const response = await batchGetUsers({
                userIds: [adminUserId, patientUserId]
            }, createServiceMetadata()) as Responses.BatchGetUsersResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Batch get users successful'));
                console.log('   Users retrieved:', response.users.length);
            } else {
                console.log(chalk.red('✗ Batch get users failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Batch get users error:'), error);
        }
    }

    async testCheckUserStatus(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Check User Status ---'));

        const checkUserStatus = promisify(internalClient, 'CheckUserStatus');

        try {
            const response = await checkUserStatus({ id: adminUserId }, createServiceMetadata()) as Responses.CheckUserStatusResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Check user status successful'));
                console.log('   Status:', response.status);
                console.log('   Role:', response.role);
                console.log('   Active:', response.active);
            } else {
                console.log(chalk.red('✗ Check user status failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Check user status error:'), error);
        }
    }

    async testVerifyUsers(): Promise<void> {
        console.log(chalk.yellow('\n--- Testing Verify Users ---'));

        const verifyUsers = promisify(internalClient, 'VerifyUsers');

        try {
            const response = await verifyUsers({
                userIds: [adminUserId, patientUserId, 'non-existent-id']
            }, createServiceMetadata()) as Responses.VerifyUsersResponse;
            console.log(chalk.yellow('\n--- Response Data ---\n ' + JSON.stringify(response)));

            if (response.success) {
                console.log(chalk.green('✓ Verify users successful'));
                console.log('   Results:', response.results.length);
                response.results.forEach(result => {
                    console.log(`   User ${result.userId}: exists=${result.exists}, active=${result.active}`);
                });
            } else {
                console.log(chalk.red('✗ Verify users failed:'), response.error);
            }
        } catch (error) {
            console.log(chalk.red('✗ Verify users error:'), error);
        }
    }


    // =================== RUN ALL TESTS ===================
    async runAllTests(): Promise<void> {
        console.log(chalk.magenta('🚀 Starting gRPC Service Tests\n'));

        await this.testHealthCheck();
        //await this.testRegister();
        await this.testAuthService();
        await this.testUserService();
        await this.testInternalService();

        console.log(chalk.magenta('\n✅ All tests completed!'));
    }
}

// =================== MAIN EXECUTION ===================
async function main() {
    const testClient = new GrpcTestClient();

    try {
        await testClient.runAllTests();
    } catch (error) {
        console.error(chalk.red('Test execution failed:'), error);
    } finally {
        // Close gRPC clients
        authClient.close();
        userClient.close();
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

export default GrpcTestClient;