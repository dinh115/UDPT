import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, ApiResponse } from '../types';

interface JwtPayload {
    id: string;
    iat: number;
    exp: number;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            const response: ApiResponse = {
                success: false,
                message: 'Access denied. No token provided.'
            };
            res.status(401).json(response);
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const user = await User.findById(decoded.id);

        if (!user) {
            const response: ApiResponse = {
                success: false,
                message: 'Invalid token.'
            };
            res.status(401).json(response);
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        const response: ApiResponse = {
            success: false,
            message: 'Invalid token.'
        };
        res.status(401).json(response);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            const response: ApiResponse = {
                success: false,
                message: 'Access denied. Please authenticate.'
            };
            res.status(401).json(response);
            return;
        }

        // console.log('User role:', req.user.role);
        // console.log('Required roles:', roles);
        if (!roles.includes(req.user.role)) {
            const response: ApiResponse = {
                success: false,
                message: 'Access denied. Insufficient privileges.'
            };
            res.status(403).json(response);
            return;
        }

        next();
    };
};