import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { IUserInput, ILoginInput, IAuthResponse } from '../types/user.types';
import { AuthRequest, ApiResponse } from '../types';

export class AuthController {
    static async register(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { name, email, password, phone, role }: IUserInput = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const response: ApiResponse = {
                    success: false,
                    message: 'User already exists with this email'
                };
                res.status(400).json(response);
                return;
            }

            // Create new user
            const user = new User({ name, email, password, phone, role });
            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            const authResponse: IAuthResponse = {
                token,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };

            const response: ApiResponse<IAuthResponse> = {
                success: true,
                data: authResponse,
                message: 'User registered successfully'
            };
            res.status(201).json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Registration failed',
                error: err.message
            };
            res.status(500).json(response);
        }
    }

    static async login(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { email, password }: ILoginInput = req.body;

            // Find user and include password for comparison
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Invalid email or password'
                };
                res.status(400).json(response);
                return;
            }

            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Invalid email or password'
                };
                res.status(400).json(response);
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            const authResponse: IAuthResponse = {
                token,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };

            const response: ApiResponse<IAuthResponse> = {
                success: true,
                data: authResponse,
                message: 'Login successful'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Login failed',
                error: err.message
            };
            res.status(500).json(response);
        }
    }

    static async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = req.user!;
            const response: ApiResponse = {
                success: true,
                data: user,
                message: 'Profile retrieved successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to retrieve profile',
                error: err.message
            };
            res.status(500).json(response);
        }
    }
}