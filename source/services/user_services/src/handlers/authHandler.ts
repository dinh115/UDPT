import * as grpc from '@grpc/grpc-js';
import { authService } from '../services/authService';
import userService from '../services/userService';
import logger from '../config/logger';
import { handleGrpcError } from './errorHandler';
import {
    convertToUserProto,
    getTokenFromMetadata,
    authenticateGrpcCall,
    convertDateToTimestamps
} from '.'
import {
    loginSchema,
    registerSchema,
    updateUserSchema,
} from '../config/joiSchema';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    LogoutRequest,
    ApiResponse,
    VerifyTokenRequest,
    VerifyTokenResponse,
    GetUserRequest,
    GetUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
} from '../proto/generated/user';
import chalk from 'chalk';



// =================== AUTH SERVICE HANDLERS ===================
export class AuthServiceHandlers {
    async login(
        call: grpc.ServerUnaryCall<LoginRequest, LoginResponse>,
        callback: grpc.sendUnaryData<LoginResponse>
    ): Promise<void> {
        try {
            const { username, password } = call.request;

            // Validate input using Joi
            const { error, value } = loginSchema.validate({ username, password });
            if (error) {
                const response = LoginResponse.create({
                    success: false,
                    error: error.details[0].message
                });
                return callback(null, response);
            }

            const result = await authService.login(value);


            const response = LoginResponse.create({
                success: true,
                token: result.token,
                user: convertToUserProto(result.user)
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error: any) {
            logger.error('Login handler error:', error);
            if (error && error.name === 'InvalidCredential') {
                const response = LoginResponse.create({
                    success: false,
                    error: 'Invalid username or password'
                });
                return callback(null, response);
            }
            else {
                const err = handleGrpcError(error);
                callback(err, null);
            }

        }
    }

    async register(
        call: grpc.ServerUnaryCall<RegisterRequest, RegisterResponse>,
        callback: grpc.sendUnaryData<RegisterResponse>
    ): Promise<void> {
        try {
            //console.log(typeof call.request.dateOfBirth);
            //console.log(call.request.dateOfBirth instanceof Date);
            //console.log(call.request.dateOfBirth);
            const { error, value } = registerSchema.validate(call.request, { stripUnknown: true });
            //console.log(chalk.bold.green('Value: ' + JSON.stringify(value)))

            if (error) {
                const response = RegisterResponse.create({
                    success: false,
                    error: error.details[0].message
                });
                return callback(null, response);
            }

            const result = await authService.register(value);

            const response = RegisterResponse.create({
                success: true,
                token: result.token,
                user: convertToUserProto(result.user)
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Register handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async logout(
        call: grpc.ServerUnaryCall<LogoutRequest, ApiResponse>,
        callback: grpc.sendUnaryData<ApiResponse>
    ): Promise<void> {
        try {
            // Get token from metadata instead of request
            const token = getTokenFromMetadata(call.metadata);

            // Validate token presence
            if (!token) {
                const response = ApiResponse.create({
                    success: false,
                    error: "Token is required in metadata (authorization or token header)"
                });
                return callback(null, response);
            }

            await authService.logout(token);

            const response = ApiResponse.create({
                success: true,
                message: "Logged out successfully"
            });
            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Logout handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async verifyToken(
        call: grpc.ServerUnaryCall<VerifyTokenRequest, VerifyTokenResponse>,
        callback: grpc.sendUnaryData<VerifyTokenResponse>
    ): Promise<void> {
        try {
            const { token } = call.request;

            if (!token) {
                const response = VerifyTokenResponse.create({
                    success: false,
                    error: 'Token is required'
                });
                return callback(null, response);
            }

            const decoded = await authService.verifySession(token);
            if (!decoded) {
                const response = VerifyTokenResponse.create({
                    success: false,
                    error: 'Invalid or expired token'
                });
                return callback(null, response);
            }

            const response = VerifyTokenResponse.create({
                success: true,
                userId: decoded.userId,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role,
                status: decoded.status,
                address: decoded.address,
                phone: decoded.phone,
                dateOfBirth: decoded.dateOfBirth ? new Date(decoded.dateOfBirth).toISOString() : undefined
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Verify token handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getProfile(
        call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>,
        callback: grpc.sendUnaryData<GetUserResponse>
    ): Promise<void> {
        try {
            // Authentication check
            const authResult = await authenticateGrpcCall(call.metadata);
            const user = authResult.user;
            if (!authResult.success || !user) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: authResult.error
                });
                return callback(null, response);
            }
            const userData = await userService.getUserById(user.userId);
            if (!userData) {
                const response = GetUserResponse.create({
                    success: false,
                    error: "User not found"
                });
                return callback(null, response);
            }

            const response = GetUserResponse.create({
                success: true,
                user: convertToUserProto(userData)
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Get profile handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }


    async updateProfile(
        call: grpc.ServerUnaryCall<UpdateUserRequest, UpdateUserResponse>,
        callback: grpc.sendUnaryData<UpdateUserResponse>
    ): Promise<void> {
        try {
            // Authentication check
            const authResult = await authenticateGrpcCall(call.metadata);
            const user = authResult.user;
            if (!authResult.success || !user) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: authResult.error
                });
                return callback(null, response);
            }
            const id = user.userId;

            if (!user || !id) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: "Unauthorized"
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = updateUserSchema.validate(call.request, { stripUnknown: true });

            //console.log(JSON.stringify(value));
            if (error) {
                const errorMessage = error.details[0].message;
                const response = UpdateUserResponse.create({
                    success: false,
                    error: errorMessage,
                });
                return callback(null, response);
            }

            // Authorization: Users can only update their own profile unless admin or employee
            if (user.role !== 'admin' && user.role !== 'employee' && user.userId !== id) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Only admins can change role and status
            if (user.role !== 'admin' && (value.role || value.status)) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: 'Only admins can change role or status',
                });
                return callback(null, response);
            }

            const userData = await userService.updateUser(id, value);
            if (!userData) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: 'User not found',
                });
                return callback(null, response);
            }

            const response = UpdateUserResponse.create({
                success: true,
                user: convertToUserProto(userData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Update profile handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }
}
