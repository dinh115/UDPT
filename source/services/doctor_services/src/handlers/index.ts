import * as grpc from '@grpc/grpc-js';
import logger from '../config/logger';
import { IDoctor, IUser, JWTPayload } from '../types';
import { config } from '../config/environments'
import {
    HealthCheckRequest,
    HealthCheckResponse,
    Doctor
} from '../proto/generated/doctor';



// Enhanced interface for user metadata
interface UserMetadata {
    userId?: string;
    email?: string;
    username?: string;
    role?: string;
    status?: string;
}


export function protoTimestampToDate(timestamp: { seconds: number | string; nanos: number }) {
    const millis = Number(timestamp.seconds) * 1000 + Math.floor(timestamp.nanos / 1e6);
    return new Date(millis);
}

export function isTimestamp(obj: any): boolean {
    return (
        obj &&
        typeof obj === 'object' &&
        'seconds' in obj &&
        'nanos' in obj &&
        Object.keys(obj).length === 2
    );
}

export function convertTimestampsToDate(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertTimestampsToDate);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (isTimestamp(value)) {
                const timestampValue = value as { seconds: number | string; nanos: number };
                const millis =
                    Number(timestampValue.seconds) * 1000 +
                    Math.floor(Number(timestampValue.nanos) / 1e6);
                newObj[key] = new Date(millis);
            } else {
                newObj[key] = convertTimestampsToDate(value);
            }
        }
        return newObj;
    }
    return obj;
}

export function withTimestampConversion(handler: any) {
    return (call: any, callback: any) => {
        call.request = convertTimestampsToDate(call.request);
        handler(call, callback);
    };
}

export function dateToProtoTimestamp(date: Date) {
    const seconds = Math.floor(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1e6;
    return { seconds, nanos };
}

export function convertDateToTimestamps(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertDateToTimestamps);
    } else if (obj instanceof Date) {
        return dateToProtoTimestamp(obj);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            newObj[key] = convertDateToTimestamps(value);
        }
        return newObj;
    }
    return obj;
}

export function convertToDoctorProto(doctor: IDoctor): Doctor {
    return {
        id: doctor._id,
        userId: doctor.userId,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualifications: doctor.qualifications,
        availability: doctor.availability,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt
    };
}

// Enhanced getUserFromMetadata function
export function getUserFromMetadata(metadata: grpc.Metadata): UserMetadata {
    const userIdValues = metadata.get('userId') || metadata.get('user_id') || metadata.get('user-id');
    const emailValues = metadata.get('email');
    const usernameValues = metadata.get('username');
    const roleValues = metadata.get('role');
    const statusValues = metadata.get('status');

    return {
        userId: userIdValues.length > 0 ? userIdValues[0] as string : undefined,
        email: emailValues.length > 0 ? emailValues[0] as string : undefined,
        username: usernameValues.length > 0 ? usernameValues[0] as string : undefined,
        role: roleValues.length > 0 ? roleValues[0] as string : undefined,
        status: statusValues.length > 0 ? statusValues[0] as string : undefined,
    };
}


/**
 * gRPC equivalent of authenticateService middleware
 */
export function authenticateService(metadata: grpc.Metadata): boolean {
    const serviceTokenValues = metadata.get('x-service-token');
    const serviceToken = serviceTokenValues.length > 0 ? serviceTokenValues[0] as string : null;

    return serviceToken === config.SERVICE_TOKEN;
}

// =================== HEALTH SERVICE HANDLERS ===================
export class HealthServiceHandlers {
    async check(
        call: grpc.ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>,
        callback: grpc.sendUnaryData<HealthCheckResponse>
    ): Promise<void> {
        try {
            const response = HealthCheckResponse.create({
                success: true,
                status: 'healthy',
                timestamp: new Date(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Health check handler error:', error);
            callback({ code: grpc.status.INTERNAL, message: 'Internal server error' }, null);
        }
    }
}

