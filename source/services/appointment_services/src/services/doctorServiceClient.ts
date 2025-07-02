
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { config } from '../config/environments';
import {
    GetAvailableTimeSlotsRequest,
    GetAvailableTimeSlotsResponse,
    GetDoctorByIdRequest,
    GetDoctorByIdResponse,
    GetDoctorByUserIdRequest,
    UpdateBookingRequest,
    UpdateBookingResponse
}
    from '../proto/generated/doctor'

export class DoctorGrpcClient {
    private internalClient: any;
    private packageDefinition: any;
    private doctorProto: any;

    constructor() {
        this.initializeClient();
    }

    private initializeClient(): void {
        // Load the proto file
        const PROTO_PATH = path.join(process.cwd(), 'src/proto/doctor.proto');

        this.packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

        this.doctorProto = grpc.loadPackageDefinition(this.packageDefinition) as any;

        // Create internal client
        this.internalClient = new this.doctorProto.doctor.InternalService(
            config.DOCTOR_SERVICE_GRPC_URL,
            grpc.credentials.createInsecure()
        );
    }

    private createServiceMetadata(): grpc.Metadata {
        const metadata = new grpc.Metadata();
        metadata.add('x-service-token', config.SERVICE_TOKEN);
        return metadata;
    }

    private promisify<TRequest, TResponse>(
        client: any,
        method: string
    ): (request: TRequest, metadata?: grpc.Metadata) => Promise<TResponse> {
        return (request: TRequest, metadata?: grpc.Metadata): Promise<TResponse> => {
            return new Promise((resolve, reject) => {
                client[method](
                    request,
                    metadata || new grpc.Metadata(),
                    (error: grpc.ServiceError | null, response: TResponse) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(response);
                        }
                    }
                );
            });
        };
    }

    // Auto-promisify all internal service methods
    private createPromisifiedMethod<TRequest, TResponse>(methodName: string) {
        return this.promisify<TRequest, TResponse>(this.internalClient, methodName);
    }

    // Specific methods with proper typing
    async getDoctorByIdInternal(request: GetDoctorByIdRequest): Promise<GetDoctorByIdResponse> {
        const method = this.createPromisifiedMethod<GetDoctorByIdRequest, GetDoctorByIdResponse>('GetDoctorByIdInternal');
        return await method(request, this.createServiceMetadata());
    }

    async getDoctorByUserIdInternal(request: GetDoctorByUserIdRequest): Promise<GetDoctorByIdResponse> {
        const method = this.createPromisifiedMethod<GetDoctorByUserIdRequest, GetDoctorByIdResponse>('GetDoctorByUserIdInternal');
        return await method(request, this.createServiceMetadata());
    }

    async getSlotsInternal(request: GetAvailableTimeSlotsRequest): Promise<GetAvailableTimeSlotsResponse> {
        const method = this.createPromisifiedMethod<GetAvailableTimeSlotsRequest, GetAvailableTimeSlotsResponse>('GetAvailableTimeSlots');
        return await method(request, this.createServiceMetadata());
    }

    async updateSlotBookingStatusInternal(request: UpdateBookingRequest): Promise<UpdateBookingResponse> {
        const method = this.createPromisifiedMethod<UpdateBookingRequest, UpdateBookingResponse>('UpdateBooking');
        return await method(request, this.createServiceMetadata());
    }
    // Generic method for any doctor service call
    async callMethod<TRequest, TResponse>(
        methodName: string,
        request: TRequest,
        includeMetadata: boolean = true
    ): Promise<TResponse> {
        const method = this.createPromisifiedMethod<TRequest, TResponse>(methodName);
        const metadata = includeMetadata ? this.createServiceMetadata() : undefined;
        return await method(request, metadata);
    }

    // Health check method
    async healthCheck(): Promise<boolean> {
        try {
            await this.callMethod('HealthCheck', {});
            return true;
        } catch (error) {
            console.error('Doctor service health check failed:', error);
            return false;
        }
    }

    // Close the connection
    close(): void {
        if (this.internalClient) {
            this.internalClient.close();
        }
    }

    // Utility method to check if service is available
    async isServiceAvailable(): Promise<boolean> {
        return new Promise((resolve) => {
            const deadline = new Date();
            deadline.setSeconds(deadline.getSeconds() + 5); // 5 second timeout

            this.internalClient.waitForReady(deadline, (error: Error | null) => {
                resolve(error === null);
            });
        });
    }
}

// Singleton pattern for global use
export class DoctorServiceManager {
    private static instance: DoctorGrpcClient;

    static getInstance(): DoctorGrpcClient {
        if (!DoctorServiceManager.instance) {
            DoctorServiceManager.instance = new DoctorGrpcClient();
        }
        return DoctorServiceManager.instance;
    }

    static async closeConnection(): Promise<void> {
        if (DoctorServiceManager.instance) {
            DoctorServiceManager.instance.close();
            DoctorServiceManager.instance = null as any;
        }
    }
}
