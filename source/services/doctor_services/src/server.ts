import chalk from 'chalk';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

import logger from './config/logger';
import { connectDatabase } from './config/database';

// Import gRPC handlers
import { DoctorServiceHandlers } from './handlers/doctorHandler';
import { InternalServiceHandlers } from './handlers/internalHandler';
import { HealthServiceHandlers, withTimestampConversion } from './handlers';

// Load environment variables
import { config } from './config/environments';


// =================== GRPC SETUP ===================
const PROTO_PATH = path.join(process.cwd(), 'src/proto/doctor.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const doctorProto = grpc.loadPackageDefinition(packageDefinition) as any;

// =================== GRPC SERVER SETUP ===================
function createGrpcServer(): grpc.Server {
    const server = new grpc.Server();

    // Initialize handlers
    const doctorHandlers = new DoctorServiceHandlers();
    const internalHandlers = new InternalServiceHandlers();
    const healthHandlers = new HealthServiceHandlers();

    // Add services to gRPC server
    server.addService(doctorProto.doctor.DoctorService.service, {
        CreateDoctorProfile: withTimestampConversion(doctorHandlers.createDoctorProfile.bind(doctorHandlers)),
        findDoctors: withTimestampConversion(doctorHandlers.getDoctors.bind(doctorHandlers)),
        GetDoctorById: withTimestampConversion(doctorHandlers.getDoctorProfileById.bind(doctorHandlers)),
        GetDoctorByUserId: withTimestampConversion(doctorHandlers.getDoctorProfileByUserId.bind(doctorHandlers)),
        UpdateDoctorProfile: withTimestampConversion(doctorHandlers.updateDoctorProfile.bind(doctorHandlers)),
        UpdateDoctorAvailability: withTimestampConversion(doctorHandlers.updateDoctorAvailability.bind(doctorHandlers)),
        DeleteDoctors: withTimestampConversion(doctorHandlers.deleteDoctors.bind(doctorHandlers)),
    });

    server.addService(doctorProto.doctor.InternalService.service, {
        GetDoctorByIdInternal: withTimestampConversion(internalHandlers.getDoctorByIdInternal.bind(internalHandlers)),
        GetDoctorByUserIdInternal: withTimestampConversion(internalHandlers.getDoctorByUserIdInternal.bind(internalHandlers)),
        GetDoctorsInternal: withTimestampConversion(internalHandlers.getDoctorsInternal.bind(internalHandlers)),
        BatchGetDoctors: withTimestampConversion(internalHandlers.batchGetDoctors.bind(internalHandlers)),
        GetAvailableTimeSlots: withTimestampConversion(internalHandlers.getAvailableSlots.bind(internalHandlers)),
        GenerateTimeSlots: withTimestampConversion(internalHandlers.generateTimeSlot.bind(internalHandlers)),
        GetDoctorSlotStatistics: withTimestampConversion(internalHandlers.getDoctorSlotStatistics.bind(internalHandlers)),
        UpdateBooking: withTimestampConversion(internalHandlers.updateBooking.bind(internalHandlers)),
    });

    server.addService(doctorProto.doctor.HealthService.service, {
        Check: withTimestampConversion(healthHandlers.check.bind(healthHandlers)),
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
        // Connect to database
        await connectDatabase();
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

                logger.info(chalk.blue(`✓ Doctor gRPC server running on ${grpcHost}:${boundPort}`));
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
                    logger.info(chalk.green('✓ Doctor gRPC server shut down gracefully'));
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
        logger.error('Failed to start doctor servers:', error);
        process.exit(1);
    }
};

// =================== ERROR HANDLERS ===================
process.on('uncaughtException', async (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the servers
startServers().catch(error => {
    logger.error('Failed to start doctor application:', error);
    process.exit(1);
});