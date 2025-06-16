// Express Request extension
import { Request } from 'express';
import { IUser } from './user.types';

export interface AuthRequest extends Request {
    user?: IUser;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}