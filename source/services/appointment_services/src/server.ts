import chalk from 'chalk';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

import logger from './config/logger';
import { connectDatabase } from './config/database';

// Import gRPC handlers
import { AppointmentServiceHandlers } from './handlers/appointmentHandler';
import { HealthServiceHandlers, withTimestampConversion } from './handlers/';

// Load environment variables
import { config } from './config/environments';

// =================== GRPC SETUP ===================
const PROTO_PATH = path.join(process.cwd(), 'src/proto/appointment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const appointmentProto = grpc.loadPackageDefinition(packageDefinition) as any;

// =================== GRPC SERVER SETUP ===================
function createGrpcServer(): grpc.Server {
    const server = new grpc.Server();

    // Initialize handlers
    const appointmentHandlers = new AppointmentServiceHandlers();
    const healthHandlers = new HealthServiceHandlers();

    // Add AppointmentService to gRPC server
    server.addService(appointmentProto.appointment.AppointmentService.service, {
        BookAppointment: withTimestampConversion(appointmentHandlers.bookAppointment.bind(appointmentHandlers)),
        UpdateAppointment: withTimestampConversion(appointmentHandlers.updateAppointment.bind(appointmentHandlers)),
        AcceptAppointment: withTimestampConversion(appointmentHandlers.acceptAppointment.bind(appointmentHandlers)),
        CancelAppointment: withTimestampConversion(appointmentHandlers.cancelAppointment.bind(appointmentHandlers)),
        GetMyAppointments: withTimestampConversion(appointmentHandlers.getMyAppointments.bind(appointmentHandlers)),
    });

    // Add HealthService to gRPC server
    server.addService(appointmentProto.appointment.HealthService.service, {
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
const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Start gRPC server
        const grpcServer = createGrpcServer();

        const grpcPort = config.GRPC_PORT || process.env.GRPC_PORT || 3004;
        const grpcHost = config.GRPC_HOST || process.env.GRPC_HOST || '0.0.0.0';

        grpcServer.bindAsync(
            `${grpcHost}:${grpcPort}`,
            grpc.ServerCredentials.createInsecure(),
            (err, boundPort) => {
                if (err) {
                    logger.error('Failed to bind gRPC server:', err);
                    throw err;
                }

                logger.info(chalk.blue(`✓ Appointment gRPC server running on ${grpcHost}:${boundPort}`));
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
                    logger.info(chalk.green('✓ Appointment gRPC server shut down gracefully'));
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
        logger.error('Failed to start appointment server:', error);
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

// Start the server
startServer().catch(error => {
    logger.error('Failed to start appointment application:', error);
    process.exit(1);
});