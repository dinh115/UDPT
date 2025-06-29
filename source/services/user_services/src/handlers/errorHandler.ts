import * as grpc from '@grpc/grpc-js';
import logger from '../config/logger';

// =================== CUSTOM ERROR CLASSES ===================
export class GrpcError extends Error {
    public code: grpc.status;
    public details?: string;
    public metadata?: grpc.Metadata;

    constructor(
        code: grpc.status,
        message: string,
        details?: string,
        metadata?: grpc.Metadata
    ) {
        super(message);
        this.name = 'GrpcError';
        this.code = code;
        this.details = details || message;
        this.metadata = metadata || new grpc.Metadata();
    }
}

export class AuthenticationError extends Error {
    constructor(message: string = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends Error {
    constructor(message: string = 'Access denied') {
        super(message);
        this.name = 'AuthorizationError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends Error {
    constructor(message: string = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
    }
}

// =================== ERROR MAPPING ===================
const errorMappings = new Map([
    // MongoDB/Mongoose errors
    ['CastError', { code: grpc.status.INVALID_ARGUMENT, message: 'Invalid ID format' }],
    ['ValidationError', { code: grpc.status.INVALID_ARGUMENT, extractMessage: true }],

    // JWT errors
    ['JsonWebTokenError', { code: grpc.status.UNAUTHENTICATED, message: 'Invalid token' }],
    ['TokenExpiredError', { code: grpc.status.UNAUTHENTICATED, message: 'Token expired' }],
    ['NotBeforeError', { code: grpc.status.UNAUTHENTICATED, message: 'Token not active yet' }],

    // Custom application errors
    ['AuthenticationError', { code: grpc.status.UNAUTHENTICATED }],
    ['AuthorizationError', { code: grpc.status.PERMISSION_DENIED }],
    ['ValidationError', { code: grpc.status.INVALID_ARGUMENT }],
    ['NotFoundError', { code: grpc.status.NOT_FOUND }],
    ['ConflictError', { code: grpc.status.ALREADY_EXISTS }],

    ['InvalidCredentials', { code: grpc.status.UNAUTHENTICATED }],
    ['NotActive', { code: grpc.status.PERMISSION_DENIED }],
    ['TokenRequired', { code: grpc.status.UNAUTHENTICATED }],
    ['RegistrationError', { code: grpc.status.INVALID_ARGUMENT }],
]);

// =================== MAIN ERROR HANDLER ===================
export function handleGrpcError(error: any): grpc.ServiceError {
    // Enhanced logging with more context
    logger.error('gRPC Error occurred:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
        ...(error.keyValue && { duplicateField: error.keyValue }),
        ...(error.errors && { validationErrors: error.errors })
    });

    // If it's already a gRPC error, return as-is
    if (error.code && typeof error.code === 'number' && error.message) {
        return error as grpc.ServiceError;
    }

    const serviceError = new Error() as grpc.ServiceError;
    serviceError.name = error.name || 'Error';
    serviceError.metadata = new grpc.Metadata();

    // Default fallback
    serviceError.code = grpc.status.INTERNAL;
    serviceError.message = 'Internal server error';
    serviceError.details = error.message || 'An unexpected error occurred';

    // Handle MongoDB duplicate key error (11000)
    if (error.code === 11000 || error.code === '11000') {
        const duplicateField = extractDuplicateField(error);
        serviceError.code = grpc.status.ALREADY_EXISTS;
        serviceError.message = getDuplicateFieldMessage(duplicateField);
        serviceError.details = `Duplicate value for field: ${duplicateField}`;
        return serviceError;
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError' && error.errors) {
        serviceError.code = grpc.status.INVALID_ARGUMENT;
        serviceError.message = extractValidationMessages(error.errors);
        serviceError.details = serviceError.message;
        return serviceError;
    }

    // Handle mapped errors
    const mapping = errorMappings.get(error.name);
    if (mapping) {
        serviceError.code = mapping.code;

        if (mapping.message) {
            serviceError.message = mapping.message;
        } else {
            serviceError.message = error.message || 'Error occurred';
        }

        if (mapping.extractMessage && error.errors) {
            serviceError.message = extractValidationMessages(error.errors);
        }

        serviceError.details = error.message || serviceError.message;
        return serviceError;
    }

    // Handle specific message patterns
    if (error.message) {
        if (error.message.toLowerCase().includes('not found')) {
            serviceError.code = grpc.status.NOT_FOUND;
            serviceError.message = error.message;
        } else if (error.message.toLowerCase().includes('already exists')) {
            serviceError.code = grpc.status.ALREADY_EXISTS;
            serviceError.message = error.message;
        } else if (error.message.toLowerCase().includes('unauthorized')) {
            serviceError.code = grpc.status.UNAUTHENTICATED;
            serviceError.message = error.message;
        } else if (error.message.toLowerCase().includes('forbidden') ||
            error.message.toLowerCase().includes('access denied')) {
            serviceError.code = grpc.status.PERMISSION_DENIED;
            serviceError.message = error.message;
        }
    }

    return serviceError;
}

// =================== HELPER FUNCTIONS ===================
function extractDuplicateField(error: any): string {
    if (error.keyValue) {
        return Object.keys(error.keyValue)[0] || 'unknown';
    }

    // Fallback: try to extract from error message
    const match = error.message?.match(/index: (\w+)_/);
    return match ? match[1] : 'unknown';
}

function getDuplicateFieldMessage(field: string): string {
    const fieldMessages = {
        email: 'Email address is already registered',
        username: 'Username is already taken',
        phone: 'Phone number is already registered',
        slug: 'URL slug is already in use'
    };

    return fieldMessages[field as keyof typeof fieldMessages] ||
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
}

function extractValidationMessages(errors: any): string {
    return Object.values(errors)
        .map((error: any) => error.message || 'Validation failed')
        .join(', ');
}

// =================== CONVENIENCE ERROR CREATORS ===================
export function createGrpcError(
    code: grpc.status,
    message: string,
    details?: string
): grpc.ServiceError {
    return new GrpcError(code, message, details) as grpc.ServiceError;
}

export function createAuthError(message?: string): grpc.ServiceError {
    return createGrpcError(
        grpc.status.UNAUTHENTICATED,
        message || 'Authentication required'
    );
}

export function createPermissionError(message?: string): grpc.ServiceError {
    return createGrpcError(
        grpc.status.PERMISSION_DENIED,
        message || 'Access denied'
    );
}

export function createValidationError(message: string): grpc.ServiceError {
    return createGrpcError(
        grpc.status.INVALID_ARGUMENT,
        message
    );
}

export function createNotFoundError(resource?: string): grpc.ServiceError {
    const message = resource ? `${resource} not found` : 'Resource not found';
    return createGrpcError(grpc.status.NOT_FOUND, message);
}

export function createConflictError(message: string): grpc.ServiceError {
    return createGrpcError(grpc.status.ALREADY_EXISTS, message);
}

// =================== BACKWARD COMPATIBILITY ===================
// Keep the old function for existing code
export function createError(name: string, message: string): Error {
    const error = new Error(message);
    error.name = name;
    return error;
}

// =================== ERROR STATUS CHECKER ===================
export function isGrpcError(error: any): error is grpc.ServiceError {
    return error && typeof error.code === 'number' && typeof error.message === 'string';
}

export function getGrpcStatusName(code: grpc.status): string {
    return grpc.status[code] || 'UNKNOWN';
}