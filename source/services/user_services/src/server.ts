import chalk from 'chalk';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

import redisConnection from './config/redis';
import logger from './config/logger';
import { connectDatabase } from './config/database';

// Import gRPC handlers
import { AuthServiceHandlers } from './handlers/authHandler';
import { UserServiceHandlers } from './handlers/userHandler';
import { InternalServiceHandlers } from './handlers/internalHandler';
import { HealthServiceHandlers } from './handlers';

// Load environment variables
import { config } from './config/environments';


// =================== GRPC SETUP ===================
const PROTO_PATH = path.join(__dirname, 'proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition) as any;
// =================== GRPC SERVER SETUP ===================
function createGrpcServer(): grpc.Server {
    const server = new grpc.Server();

    // Initialize handlers
    const authHandlers = new AuthServiceHandlers();
    const userHandlers = new UserServiceHandlers();
    const internalHandlers = new InternalServiceHandlers();
    const healthHandlers = new HealthServiceHandlers();

    // Add services to gRPC server
    server.addService(userProto.user.AuthService.service, {
        Login: authHandlers.login.bind(authHandlers),
        Register: authHandlers.register.bind(authHandlers),
        Logout: authHandlers.logout.bind(authHandlers),
        VerifyToken: authHandlers.verifyToken.bind(authHandlers),
        GetProfile: authHandlers.getProfile.bind(authHandlers),
        UpdateProfile: authHandlers.updateProfile.bind(authHandlers),
    });

    server.addService(userProto.user.UserService.service, {
        GetUser: userHandlers.getUser.bind(userHandlers),
        GetUsers: userHandlers.getUsers.bind(userHandlers),
        CreateUser: userHandlers.createUser.bind(userHandlers),
        UpdateUser: userHandlers.updateUser.bind(userHandlers),
        DeleteUsers: userHandlers.deleteUsers.bind(userHandlers),
    });

    server.addService(userProto.user.InternalService.service, {
        GetUserInternal: internalHandlers.getUserInternal.bind(internalHandlers),
        BatchGetUsers: internalHandlers.batchGetUsers.bind(internalHandlers),
        CheckUserStatus: internalHandlers.checkUserStatus.bind(internalHandlers),
        VerifyUsers: internalHandlers.verifyUsers.bind(internalHandlers),
    });

    server.addService(userProto.user.HealthService.service, {
        Check: healthHandlers.check.bind(healthHandlers),
    });

    // Add interceptors for logging and error handling
    server.addService = ((originalAddService) => {
        return function (this: grpc.Server, service: any, implementation: any) {
            // Wrap each method with logging
            const wrappedImplementation: any = {};

            for (const [methodName, method] of Object.entries(implementation)) {
                wrappedImplementation[methodName] = async function (
                    call: grpc.ServerUnaryCall<any, any>,
                    callback: grpc.sendUnaryData<any>
                ) {
                    const startTime = Date.now();
                    const clientIP = call.getPeer();

                    logger.info(`gRPC ${methodName} called from ${clientIP}`);

                    try {
                        await (method as Function).call(this, call, (error: any, response: any) => {
                            const duration = Date.now() - startTime;

                            if (error) {
                                logger.error(`gRPC ${methodName} error:`, {
                                    error: error.message,
                                    code: error.code,
                                    duration: `${duration}ms`,
                                    clientIP
                                });
                            } else {
                                logger.info(`gRPC ${methodName} completed in ${duration}ms`);
                            }

                            callback(error, response);
                        });
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        logger.error(`gRPC ${methodName} uncaught error:`, {
                            error: (error as Error).message,
                            duration: `${duration}ms`,
                            clientIP
                        });

                        callback({
                            code: grpc.status.INTERNAL,
                            message: 'Internal server error'
                        }, null);
                    }
                };
            }

            return originalAddService.call(this, service, wrappedImplementation);
        };
    })(server.addService.bind(server));

    return server;
}


// =================== SERVER STARTUP ===================
const startServers = async () => {
    try {
        // Connect to database and Redis
        await connectDatabase();
        await redisConnection.connect();

        // Start gRPC server
        const grpcServer = createGrpcServer();

        const grpcPort = config.GRPC_PORT;
        const grpcHost = config.GRPC_HOST;

        grpcServer.bindAsync(
            `${grpcHost}:${grpcPort}`,
            grpc.ServerCredentials.createInsecure(),
            (err, boundPort) => {
                if (err) {
                    logger.error('Failed to bind gRPC server:', err);
                    throw err;
                }

                logger.info(chalk.blue(`✓ gRPC server running on ${grpcHost}:${boundPort}`));
            }
        );

        // Graceful shutdown handlers
        const gracefulShutdown = async (signal: string) => {
            console.log(chalk.bgYellow(`${signal} received, shutting down gracefully...`));

            // Stop accepting new gRPC calls
            grpcServer.tryShutdown((err) => {
                if (err) {
                    logger.error('Error during gRPC server shutdown:', err);
                    grpcServer.forceShutdown();
                } else {
                    logger.info(chalk.green('✓ gRPC server shut down gracefully'));
                }
            });

            // Force shutdown after timeout
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        return { grpcServer };

    } catch (error) {
        logger.error('Failed to start servers:', error);
        await redisConnection.disconnect();
        process.exit(1);
    }
};

// =================== ERROR HANDLERS ===================
process.on('uncaughtException', async (error) => {
    logger.error('Uncaught Exception:', error);
    await redisConnection.disconnect();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await redisConnection.disconnect();
    process.exit(1);
});

// Start the servers
startServers().catch(error => {
    logger.error('Failed to start application:', error);
    process.exit(1);
});

