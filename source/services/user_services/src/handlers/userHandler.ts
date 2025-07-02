import * as grpc from '@grpc/grpc-js';
import userService from '../services/userService';
import logger from '../config/logger';
import { handleGrpcError } from './errorHandler';
import { userQuerySchema } from '../config/joiSchema';
import chalk from 'chalk';
import {
    convertToUserProto,
    authenticateGrpcCall,
    convertDateToTimestamps,
} from '.'
import {
    createUserSchema,
    updateUserSchema,
    batchUsersSchema,
    validateUserIdSchema
} from '../config/joiSchema';
import {
    GetUserRequest,
    GetUserResponse,
    GetUsersRequest,
    GetUsersResponse,
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    BatchDeleteUsersRequest,
    BatchDeleteUsersResponse
} from '../proto/generated/user';

// =================== USER SERVICE HANDLERS ===================
export class UserServiceHandlers {
    async getUser(
        call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>,
        callback: grpc.sendUnaryData<GetUserResponse>
    ): Promise<void> {
        try {
            // Authentication check
            const authResult = await authenticateGrpcCall(call.metadata);
            const user = authResult.user;
            if (!authResult.success || !user) {
                const response = GetUserResponse.create({
                    success: false,
                    error: authResult.error
                });
                return callback(null, response);
            }
            //console.log(chalk.green(JSON.stringify(user)));
            const { error, value } = validateUserIdSchema.validate(call.request);
            if (error) {
                const response = GetUserResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }
            const { id } = value;
            //console.log(chalk.blue(id));

            // Authorization: Users can only view their own profile unless admin or employee
            if (user.role !== 'admin' && user.role !== 'employee' && user.userId !== id) {
                const response = GetUserResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            const userData = await userService.getUserById(id);
            if (!userData) {
                const response = GetUserResponse.create({
                    success: false,
                    error: 'User not found',
                });
                return callback(null, response);
            }
            const response = GetUserResponse.create({
                success: true,
                user: convertToUserProto(userData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Get user handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getUsers(
        call: grpc.ServerUnaryCall<GetUsersRequest, GetUsersResponse>,
        callback: grpc.sendUnaryData<GetUsersResponse>
    ): Promise<void> {
        try {
            // Authentication check
            const authResult = await authenticateGrpcCall(call.metadata);
            const user = authResult.user;
            if (!authResult.success || !user) {
                const response = GetUsersResponse.create({
                    success: false,
                    error: authResult.error
                });
                return callback(null, response);
            }

            // Authorization: only admin or employee are allowed to access this functionality
            if (user.role !== 'admin' && user.role !== 'employee') {
                const response = GetUsersResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            //console.log(call.request);

            const { error, value } = userQuerySchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = GetUsersResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);

            }
            //console.log(value);

            let result = await userService.findUsers(value);

            // Remove password field for non-admin users
            if (user.role !== 'admin') {
                const { users, ...rest } = result;
                const usersNoPassword = users.map((user: any) => {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                });
                result = { users: usersNoPassword, ...rest };
            }

            const response = GetUsersResponse.create({
                success: true,
                users: result.users.map(user => convertToUserProto(user)),
                pagination: {
                    currentPage: result.currentPage,
                    totalPages: result.totalPages,
                    totalItems: result.totalCount,
                    itemsPerPage: value.limit,
                    hasNext: result.hasNextPage,
                    hasPrevious: result.hasPrevPage
                }
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Get users handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async createUser(
        call: grpc.ServerUnaryCall<CreateUserRequest, CreateUserResponse>,
        callback: grpc.sendUnaryData<CreateUserResponse>
    ): Promise<void> {
        try {
            // Authentication check
            const authResult = await authenticateGrpcCall(call.metadata);
            const user = authResult.user;
            if (!authResult.success || !user) {
                const response = CreateUserResponse.create({
                    success: false,
                    error: authResult.error
                });
                return callback(null, response);
            }

            // Only admins can create users
            if (user.role !== 'admin') {
                const response = CreateUserResponse.create({
                    success: false,
                    error: "Admin access required",
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { email, username, password, firstName, lastName, role, status } = call.request;
            const { error, value } = createUserSchema.validate(
                { email, username, password, firstName, lastName, role, status });
            if (error) {
                const response = CreateUserResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);

            }

            const userData = await userService.createUser(value);

            const response = CreateUserResponse.create({
                success: true,
                user: convertToUserProto(userData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Create user handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async updateUser(
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
            // Check for authenticated user
            const { id } = call.request;

            if (!id) {
                const response = UpdateUserResponse.create({
                    success: false,
                    error: 'User Id is required when update user.',
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

            // Validate input using Joi
            const { error, value } = updateUserSchema.validate(call.request, { stripUnknown: true });
            if (error) {
                const errorMessage = error.details[0].message;
                const response = UpdateUserResponse.create({
                    success: false,
                    error: errorMessage,
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
            logger.error('Update user handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async deleteUsers(
        call: grpc.ServerUnaryCall<BatchDeleteUsersRequest, BatchDeleteUsersResponse>,
        callback: grpc.sendUnaryData<BatchDeleteUsersResponse>
    ): Promise<void> {
        try {
            // Authentication check
            const authResult = await authenticateGrpcCall(call.metadata);
            const user = authResult.user;
            if (!authResult.success || !user) {
                const response = BatchDeleteUsersResponse.create({
                    success: false,
                    error: authResult.error
                });
                return callback(null, response);
            }

            // Only admins can delete users
            if (user.role !== 'admin') {
                const response = BatchDeleteUsersResponse.create({
                    success: false,
                    error: 'Admin access required',
                });
                return callback(null, response);
            }

            const { error, value } = batchUsersSchema.validate(call.request);
            if (error) {
                const response = BatchDeleteUsersResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            const success = await userService.deleteUsers(value.userIds);
            if (!success) {
                const response = BatchDeleteUsersResponse.create({
                    success: false,
                    error: 'User not found',
                });
                return callback(null, response);
            }

            const response = BatchDeleteUsersResponse.create({
                success: true,
                message: 'User deleted successfully',
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Delete user handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

}