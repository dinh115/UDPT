import * as grpc from '@grpc/grpc-js';
import { authService } from '../services/authService';
import logger from '../config/logger';
import { IUser, JWTPayload } from '../types';
import { config } from '../config/environments'
import {
    User,
    HealthCheckRequest,
    HealthCheckResponse
} from '../proto/generated/user';

interface UserMetadata {
    userId?: string;
    email?: string;
    username?: string;
    role?: string;
    status?: string;
}

export function dateToProtoTimestamp(date: Date) {
    const seconds = Math.floor(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1e6;
    return { seconds, nanos };
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
// Helper function to extract token from metadata
export function getTokenFromMetadata(metadata: grpc.Metadata): string | null {
    // Try different possible metadata keys for token
    const authHeader = metadata.get('authorization')[0] as string;
    const tokenHeader = metadata.get('token')[0] as string;

    if (authHeader) {
        // Handle Bearer token format
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    if (tokenHeader) {
        return tokenHeader;
    }

    return null;
}

export function convertToUserProto(user: IUser): User {
    return {
        id: user._id || user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth
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

// Middleware-like function to verify token and populate metadata
export async function verifyTokenAndPopulateMetadata(
    metadata: grpc.Metadata,
    requiredRole?: string
): Promise<{ success: boolean; user?: UserMetadata; error?: string }> {
    try {
        const token = getTokenFromMetadata(metadata);

        if (!token) {
            return {
                success: false,
                error: 'Token is required in metadata (authorization or token header)'
            };
        }

        const decoded = await authService.verifySession(token);
        if (!decoded) {
            return {
                success: false,
                error: 'Invalid or expired token'
            };
        }

        const user: UserMetadata = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role,
            status: decoded.status
        };

        // Check role requirement if specified
        if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
            return {
                success: false,
                error: `Access denied. Required role: ${requiredRole}`
            };
        }

        // Populate metadata for downstream use
        metadata.set('userId', user.userId!);
        metadata.set('email', user.email!);
        metadata.set('username', user.username!);
        metadata.set('role', user.role!);
        metadata.set('status', user.status!);

        return { success: true, user };
    } catch (error) {
        logger.error('Token verification error:', error);
        return {
            success: false,
            error: 'Token verification failed'
        };
    }
}

/**
 * gRPC equivalent of authMiddleware
*/
export async function authenticateGrpcCall(metadata: grpc.Metadata): Promise<{ success: boolean; user?: JWTPayload; error?: string }> {
    try {
        const token = getTokenFromMetadata(metadata);

        if (!token) {
            return {
                success: false,
                error: 'No token provided in metadata (authorization or token header)'
            };
        }

        // Verify token and session
        const payload = await authService.verifySession(token);
        if (!payload) {
            return {
                success: false,
                error: 'Invalid or expired token'
            };
        }

        return { success: true, user: payload };
    } catch (error) {
        logger.error('gRPC Authentication error:', error);
        return {
            success: false,
            error: 'Authentication failed'
        };
    }
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

            callback(null, response);
        } catch (error) {
            logger.error('Health check handler error:', error);
            callback({ code: grpc.status.INTERNAL, message: 'Internal server error' }, null);
        }
    }
}

