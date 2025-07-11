import * as grpc from '@grpc/grpc-js';
import { doctorService } from '../services/doctorService';
import logger from '../config/logger';
import { handleGrpcError } from './errorHandler';
import {
    doctorQuerySchema,
    isValidUUID,
    validateDoctorIdSchema,
    createDoctorProfileSchema,
    updateDoctorProfileSchema,
    updateDoctorAvailabilitySchema,
    batchDoctorProfileSchema,
    validateUserIdSchema
} from '../config/joiSchema';
import chalk from 'chalk';
import { convertToDoctorProto, getUserFromMetadata, convertDateToTimestamps } from '.';
import {
    GetDoctorByIdRequest,
    GetDoctorByUserIdRequest,
    GetDoctorByIdResponse,
    findDoctorsRequest,
    findDoctorsResponse,
    CreateDoctorProfileRequest,
    CreateDoctorProfileResponse,
    BatchDeleteDoctorsRequest,
    BatchDeleteDoctorsResponse,
    ApiResponse,
    UpdateDoctorProfileRequest,
    UpdateDoctorProfileResponse,
    UpdateDoctorAvailabilityRequest

} from '../proto/generated/doctor';

// =================== DOCTOR SERVICE HANDLERS ===================
export class DoctorServiceHandlers {
    async getDoctorProfileById(
        call: grpc.ServerUnaryCall<GetDoctorByIdRequest, GetDoctorByIdResponse>,
        callback: grpc.sendUnaryData<GetDoctorByIdResponse>
    ): Promise<void> {
        try {
            // Get user metadata
            // const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));
            // if (!user) {
            //     const response = GetDoctorByIdResponse.create({
            //         success: false,
            //         error: 'Access denied',
            //     });
            //     return callback(null, response);
            // }

            const { error, value } = validateDoctorIdSchema.validate(call.request);
            if (error) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            const doctorData = await doctorService.getDoctorById(value.doctorId);
            if (!doctorData) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: 'Doctor not found',
                });
                return callback(null, response);
            }
            const response = GetDoctorByIdResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctorData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Get doctor by id handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getDoctorProfileByUserId(
        call: grpc.ServerUnaryCall<GetDoctorByUserIdRequest, GetDoctorByIdResponse>,
        callback: grpc.sendUnaryData<GetDoctorByIdResponse>
    ): Promise<void> {
        try {
            // Get user metadata
            //const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));
            // if (!user) {
            //     const response = GetDoctorByIdResponse.create({
            //         success: false,
            //         error: 'Access denied',
            //     });
            //     return callback(null, response);
            // }

            const { error, value } = validateUserIdSchema.validate(call.request);
            if (error) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            const doctorData = await doctorService.getDoctorByUserId(value.userId);
            if (!doctorData) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: 'Doctor not found',
                });
                return callback(null, response);
            }
            const response = GetDoctorByIdResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctorData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Get doctor by user id handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }


    async getDoctors(
        call: grpc.ServerUnaryCall<findDoctorsRequest, findDoctorsResponse>,
        callback: grpc.sendUnaryData<findDoctorsResponse>
    ): Promise<void> {
        try {
            //const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));

            // if (!user) {
            //     const response = findDoctorsResponse.create({
            //         success: false,
            //         error: 'Access denied',
            //     });
            //     return callback(null, response);
            // }

            //console.log(call.request);

            const { error, value } = doctorQuerySchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = findDoctorsResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);

            }

            //console.log(value);

            let result = await doctorService.findDoctors(value);

            const response = findDoctorsResponse.create({
                success: true,
                doctors: result.doctors.map(doctor => convertToDoctorProto(doctor)),
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
            logger.error('Get doctors handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async createDoctorProfile(
        call: grpc.ServerUnaryCall<CreateDoctorProfileRequest, CreateDoctorProfileResponse>,
        callback: grpc.sendUnaryData<CreateDoctorProfileResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));
            //console.log(chalk.yellow(JSON.stringify(call.request)));

            if (!user) {
                const response = CreateDoctorProfileResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Only admins can create users
            if (user.role !== 'admin') {
                const response = CreateDoctorProfileResponse.create({
                    success: false,
                    error: "Admin access required",
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = createDoctorProfileSchema.validate(call.request);
            if (error) {
                const response = CreateDoctorProfileResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);

            }

            //console.log(chalk.yellow(JSON.stringify(value)));

            const doctorData = await doctorService.createDoctorProfile(value);
            //console.log(chalk.blue(JSON.stringify(doctorData)));

            const response = CreateDoctorProfileResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctorData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Create doctor handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async updateDoctorProfile(
        call: grpc.ServerUnaryCall<UpdateDoctorProfileRequest, UpdateDoctorProfileResponse>,
        callback: grpc.sendUnaryData<UpdateDoctorProfileResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));
            //console.log(chalk.blue(JSON.stringify(call.request)));

            if (!user) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }
            // Check for authenticated user
            const { userId } = call.request;

            if (!userId || !isValidUUID(userId)) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'User Id is required when update user and must be in UUID format.',
                });
                return callback(null, response);
            }

            // Authorization: Doctor can only update their own profile unless admin or employee
            if (user.role !== 'admin' && user.role !== 'employee' && user.userId !== userId) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = updateDoctorProfileSchema.validate(call.request, { stripUnknown: true });
            if (error) {
                const errorMessage = error.details[0].message;
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: errorMessage,
                });
                return callback(null, response);
            }
            // Only admins can change these fields
            if (user.role !== 'admin' && (value.qualifications || value.experience || value.specialization)) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Only admins can change qualifications, experience or specialization',
                });
                return callback(null, response);

            }

            const doctorData = await doctorService.updateDoctorProfile(value);
            //console.log(chalk.blue(JSON.stringify(doctorData)));

            if (!doctorData) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Doctor not found',
                });
                return callback(null, response);

            }

            const response = UpdateDoctorProfileResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctorData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Update user handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async deleteDoctors(
        call: grpc.ServerUnaryCall<BatchDeleteDoctorsRequest, BatchDeleteDoctorsResponse>,
        callback: grpc.sendUnaryData<BatchDeleteDoctorsResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));

            if (!user) {
                const response = BatchDeleteDoctorsResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Only admins can delete doctors
            if (user.role !== 'admin') {
                const response = BatchDeleteDoctorsResponse.create({
                    success: false,
                    error: 'Admin access required',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = batchDoctorProfileSchema.validate(call.request);
            if (error) {
                const errorMessage = error.details[0].message;
                const response = BatchDeleteDoctorsResponse.create({
                    success: false,
                    error: errorMessage,
                });
                return callback(null, response);
            }

            const success = await doctorService.deleteDoctors(value.doctorIds);
            if (!success) {
                const response = BatchDeleteDoctorsResponse.create({
                    success: success,
                    error: 'Doctor not found',
                });
                return callback(null, response);

            }

            const response = BatchDeleteDoctorsResponse.create({
                success: true,
                message: 'Doctor deleted successfully',
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Delete user handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }
    async updateDoctorAvailability(
        call: grpc.ServerUnaryCall<UpdateDoctorAvailabilityRequest, UpdateDoctorProfileResponse>,
        callback: grpc.sendUnaryData<UpdateDoctorProfileResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));
            //console.log(chalk.green(JSON.stringify(call.request)));
            if (!user) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = updateDoctorAvailabilitySchema.validate(call.request);
            if (error) {
                const errorMessage = error.details[0].message;
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: errorMessage,
                });
                return callback(null, response);
            }
            const { userId } = value;


            // Authorization: Doctor can only update their own profile unless admin or employee
            if (user.role !== 'admin' && user.role !== 'employee' && user.userId !== userId) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }


            // Only admins can change these fields
            if (user.role !== 'admin' && (value.qualifications || value.experience || value.specialization)) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Only admins can change qualifications, experience or specialization',
                });
                return callback(null, response);
            }

            const doctorData = await doctorService.updateDoctorAvailability(value);

            if (!doctorData) {
                const response = UpdateDoctorProfileResponse.create({
                    success: false,
                    error: 'Doctor not found',
                });
                return callback(null, response);

            }

            const response = UpdateDoctorProfileResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctorData),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Update doctor handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }
}