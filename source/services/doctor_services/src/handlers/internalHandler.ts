import * as grpc from '@grpc/grpc-js';
import doctorService from '../services/doctorService';
import logger from '../config/logger';
import { handleGrpcError } from './errorHandler';
import { convertToDoctorProto, authenticateService } from '.';
import {
    batchDoctorProfileSchema,
    generateTimeSlotsSchema,
    validateDoctorIdSchema,
    getAvailableTimeSlotsSchema,
    doctorQuerySchema,
    getDoctorTimeSlotsStatisticsSchema,
    updateBookingSchema,
    validateUserIdSchema
} from '../config/joiSchema';
import {
    GetDoctorByIdRequest,
    GetDoctorByIdResponse,
    findDoctorsRequest,
    findDoctorsResponse,
    BatchGetDoctorsRequest,
    BatchGetDoctorsResponse,
    GetDoctorSlotStatisticsRequest,
    GetDoctorSlotStatisticsResponse,
    GetAvailableTimeSlotsRequest,
    GetAvailableTimeSlotsResponse,
    GenerateTimeSlotsRequest,
    GenerateTimeSlotsResponse,
    UpdateBookingRequest,
    UpdateBookingResponse,
    GetDoctorByUserIdRequest

} from '../proto/generated/doctor';
import chalk from 'chalk';

// =================== INTERNAL SERVICE HANDLERS ===================
export class InternalServiceHandlers {
    async getDoctorByIdInternal(
        call: grpc.ServerUnaryCall<GetDoctorByIdRequest, GetDoctorByIdResponse>,
        callback: grpc.sendUnaryData<GetDoctorByIdResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            const { error, value } = validateDoctorIdSchema.validate(call.request);
            if (error) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            const { doctorId } = value;
            const doctor = await doctorService.getDoctorById(doctorId);

            if (!doctor) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: 'User not found'
                })
                return callback(null, response);
            }

            const response = GetDoctorByIdResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctor)
            });

            callback(null, response);
        } catch (error) {
            logger.error('Get doctor by id internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getDoctorByUserIdInternal(
        call: grpc.ServerUnaryCall<GetDoctorByUserIdRequest, GetDoctorByIdResponse>,
        callback: grpc.sendUnaryData<GetDoctorByIdResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            const { error, value } = validateUserIdSchema.validate(call.request);
            if (error) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            const { userId } = value;
            const doctor = await doctorService.getDoctorByUserId(userId);

            if (!doctor) {
                const response = GetDoctorByIdResponse.create({
                    success: false,
                    error: 'User not found'
                })
                return callback(null, response);
            }

            const response = GetDoctorByIdResponse.create({
                success: true,
                doctor: convertToDoctorProto(doctor)
            });

            callback(null, response);
        } catch (error) {
            logger.error('Get doctor by user idinternal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getDoctorsInternal(
        call: grpc.ServerUnaryCall<findDoctorsRequest, findDoctorsResponse>,
        callback: grpc.sendUnaryData<findDoctorsResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = findDoctorsResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }

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

            callback(null, response);
        } catch (error) {
            logger.error('Get doctos internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }
    async batchGetDoctors(
        call: grpc.ServerUnaryCall<BatchGetDoctorsRequest, BatchGetDoctorsResponse>,
        callback: grpc.sendUnaryData<BatchGetDoctorsResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = BatchGetDoctorsResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }

            const { error, value } = batchDoctorProfileSchema.validate(call.request);

            if (error) {
                const response = BatchGetDoctorsResponse.create({
                    success: false,
                    error: error.details[0].message
                })
                return callback(null, response);
            }

            const doctors = await doctorService.getDoctorByIds(value.doctorIds);

            const response = BatchGetDoctorsResponse.create({
                success: true,
                doctors: doctors.map(user => convertToDoctorProto(user))
            })

            callback(null, response);
        } catch (error) {
            logger.error('Batch get doctors internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getDoctorSlotStatistics(
        call: grpc.ServerUnaryCall<GetDoctorSlotStatisticsRequest, GetDoctorSlotStatisticsResponse>,
        callback: grpc.sendUnaryData<GetDoctorSlotStatisticsResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = GetDoctorSlotStatisticsResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            //console.log(chalk.green(JSON.stringify(call.request)));

            const { error, value } = getDoctorTimeSlotsStatisticsSchema.validate(call.request, { stripUnknown: true });
            if (error) {
                const response = GetDoctorSlotStatisticsResponse.create({
                    success: false,
                    error: error.details[0].message
                })
                return callback(null, response);
            }
            const { doctorId, date = null } = value;
            //console.log(chalk.blue(JSON.stringify(value)));

            if (date) {
                const stats = await doctorService.getDoctorSlotStatistics({ doctorId, date });
                //console.log(chalk.bgBlue('DAILY STATS'));
                //console.log(chalk.bold(JSON.stringify(stats)));

                const response = GetDoctorSlotStatisticsResponse.create({
                    success: true,
                    message: 'OK',
                    dailyStats: {
                        date: stats.date,
                        dayOfWeek: stats.dayOfWeek,
                        totalSlots: stats.totalSlots,
                        availableSlots: stats.availableSlots,
                        bookedSlots: stats.bookedSlots
                    }
                })
                callback(null, response);

            }
            else {
                const stats = await doctorService.getDoctorSlotStatistics({ doctorId });
                //console.log(chalk.bgBlue('WEEKLY STATS'));
                //console.log(chalk.bold(JSON.stringify(stats)));
                const response = GetDoctorSlotStatisticsResponse.create({
                    success: true,
                    message: 'OK',
                    weeklyStats: {
                        overall: stats.overall,
                        weekly: stats.weekly,
                    }
                })
                callback(null, response);
            }


        } catch (error) {
            logger.error('Get doctor slot statistics internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getAvailableSlots(
        call: grpc.ServerUnaryCall<GetAvailableTimeSlotsRequest, GetAvailableTimeSlotsResponse>,
        callback: grpc.sendUnaryData<GetAvailableTimeSlotsResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = GetAvailableTimeSlotsResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            const { error, value } = getAvailableTimeSlotsSchema.validate(call.request);
            if (error) {
                const response = GetAvailableTimeSlotsResponse.create({
                    success: false,
                    error: error.details[0].message
                })
                return callback(null, response);
            }
            const { doctorId, date } = value;

            const slots = await doctorService.getDoctorAvailableSlots(doctorId, date);

            const response = GetAvailableTimeSlotsResponse.create({
                success: true,
                message: 'OK',
                slots: slots
            })
            callback(null, response);
        } catch (error) {
            logger.error('Get doctor available slots internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async generateTimeSlot(
        call: grpc.ServerUnaryCall<GenerateTimeSlotsRequest, GenerateTimeSlotsResponse>,
        callback: grpc.sendUnaryData<GenerateTimeSlotsResponse>
    ): Promise<void> {
        try {
            //console.log(chalk.bgCyan('GENERATE SLOTS WAS CALLED'));
            if (!authenticateService(call.metadata)) {
                const response = GenerateTimeSlotsResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }
            //console.log(chalk.green(JSON.stringify(call.request)));

            const { error, value } = generateTimeSlotsSchema.validate(call.request);
            //console.log(chalk.green(JSON.stringify(value)));

            if (error) {
                const response = GenerateTimeSlotsResponse.create({
                    success: false,
                    error: error.details[0].message
                })
                return callback(null, response);
            }
            const slots = await doctorService.generateTimeSlots(value);
            //console.log(chalk.green(JSON.stringify(slots)));

            const response = GenerateTimeSlotsResponse.create({
                success: true,
                message: "OK",
                data: {
                    startTime: value.startTime,
                    endTime: value.endTime,
                    gap: value.gap,
                    slots: slots,
                    totalSlots: slots.length
                }
            })

            callback(null, response);
        }
        catch (error) {
            logger.error('Generate doctor time slots internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async updateBooking(
        call: grpc.ServerUnaryCall<UpdateBookingRequest, UpdateBookingResponse>,
        callback: grpc.sendUnaryData<UpdateBookingResponse>
    ): Promise<void> {
        try {
            if (!authenticateService(call.metadata)) {
                const response = UpdateBookingResponse.create({
                    success: false,
                    error: 'Service token is required.'
                })
                return callback(null, response);
            }

            const { error, value } = updateBookingSchema.validate(call.request);
            if (error) {
                const response = UpdateBookingResponse.create({
                    success: false,
                    error: error.details[0].message
                })
                return callback(null, response);
            }

            const { doctorId, appointmentDate, timeSlot, isBooked } = value;
            const result = await doctorService.updateSlotBookingStatus(doctorId, new Date(appointmentDate), timeSlot, isBooked);

            const response = UpdateBookingResponse.create({
                success: true,
                message: 'Booking updated successfully.',
                timeSlot: result
            })

            callback(null, response);
        } catch (error) {
            logger.error('Update booking internal handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }
}
