import * as grpc from '@grpc/grpc-js';
import userService from '../services/userService';
import logger from '../config/logger';
import { handleGrpcError } from './errorHandler';
import { convertToUserProto, authenticateService } from '.';
import { batchUsersSchema } from '../config/joiSchema';
import {
    GetUserRequest,
    GetUserResponse,
    BatchGetUsersRequest,
    BatchGetUsersResponse,
    CheckUserStatusRequest,
    CheckUserStatusResponse,
    VerifyUsersRequest,
    VerifyUsersResponse
} from '../proto/generated/user';

// =================== INTERNAL SERVICE HANDLERS ===================
export class InternalServiceHandlers {
    async getUserInternal(
        call: grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>,
        callback: grpc.sendUnaryData<GetUserResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = GetUserResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);

            }
            const { id } = call.request;
            const user = await userService.getUserById(id);

            if (!user) {
                const response = GetUserResponse.create({
                    success: false,
                    error: 'User not found'
                })
                return callback(null, response);
            }

            const response = GetUserResponse.create({
                success: true,
                user: convertToUserProto(user)
            });

            callback(null, response);
        } catch (error) {
            logger.error('Get user internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }


    async batchGetUsers(
        call: grpc.ServerUnaryCall<BatchGetUsersRequest, BatchGetUsersResponse>,
        callback: grpc.sendUnaryData<BatchGetUsersResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = BatchGetUsersResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }

            const { error, value } = batchUsersSchema.validate(call.request);

            if (error) {
                const response = BatchGetUsersResponse.create({
                    success: false,
                    error: error.details[0].message
                })
                return callback(null, response);
            }

            const users = await userService.getUsersByIds(value.userIds);

            const response = BatchGetUsersResponse.create({
                success: true,
                users: users.map(user => convertToUserProto(user))
            })

            callback(null, response);
        } catch (error) {
            logger.error('Batch get users handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async checkUserStatus(
        call: grpc.ServerUnaryCall<CheckUserStatusRequest, CheckUserStatusResponse>,
        callback: grpc.sendUnaryData<CheckUserStatusResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = CheckUserStatusResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            const { id } = call.request;
            const status = await userService.checkUserStatus(id);

            if (!status.exists) {
                const response = CheckUserStatusResponse.create({
                    success: false,
                    error: 'User not found'
                })
                return callback(null, response);
            }

            const response = CheckUserStatusResponse.create(
                {
                    success: true,
                    id: id,
                    status: status.user?.status || '',
                    role: status.role || '',
                    exists: status.exists,
                    active: status.active
                }
            );

            callback(null, response);
        } catch (error) {
            logger.error('Check user status handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async verifyUsers(
        call: grpc.ServerUnaryCall<VerifyUsersRequest, VerifyUsersResponse>,
        callback: grpc.sendUnaryData<VerifyUsersResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = VerifyUsersResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            const { userIds } = call.request;

            if (!userIds || userIds.length === 0) {
                const response = VerifyUsersResponse.create({
                    success: false,
                    error: 'At least one user ID is required'
                })
                return callback(null, response);
            }

            const verificationResults = await userService.verifyUsers(userIds);

            const response = VerifyUsersResponse.create({
                success: true,
                results: verificationResults
            })
            callback(null, response);
        } catch (error) {
            logger.error('Verify users handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }


}
