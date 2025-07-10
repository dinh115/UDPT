import * as grpc from '@grpc/grpc-js';
import { AppointmentService } from '../services/appointmentService';
import logger from '../config/logger';
import { handleGrpcError } from './errorHandler';
import {
    bookAppointmentSchema,
    updateAppointmentSchema,
    acceptAppointmentSchema,
    cancelAppointmentSchema,
    getMyAppointmentsSchema,
    isValidUUID
} from '../config/joiSchema';
import chalk from 'chalk';
import { convertToAppointmentProto, getUserFromMetadata, convertDateToTimestamps } from '.';
import {
    BookAppointmentRequest,
    BookAppointmentResponse,
    UpdateAppointmentRequest,
    UpdateAppointmentResponse,
    AcceptAppointmentRequest,
    AcceptAppointmentResponse,
    CancelAppointmentRequest,
    CancelAppointmentResponse,
    GetMyAppointmentsRequest,
    GetMyAppointmentsResponse
} from '../proto/generated/appointment';
import { UserRole } from '../types';

// =================== APPOINTMENT SERVICE HANDLERS ===================
export class AppointmentServiceHandlers {
    private appointmentService = new AppointmentService();

    async bookAppointment(
        call: grpc.ServerUnaryCall<BookAppointmentRequest, BookAppointmentResponse>,
        callback: grpc.sendUnaryData<BookAppointmentResponse>
    ): Promise<void> {
        try {
            // Get user metadata
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));

            if (!user || !user.userId) {
                const response = BookAppointmentResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Only patients can book appointments for themselves
            if (user.role !== UserRole.PATIENT && user.role !== UserRole.EMPLOYEE && user.role !== UserRole.ADMIN) {
                const response = BookAppointmentResponse.create({
                    success: false,
                    error: 'Only patients, employees or admins can book appointments',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = bookAppointmentSchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = BookAppointmentResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            // Validate timeSlot requirements
            const { appointmentDate, timeSlot } = value;
            if ((appointmentDate && !timeSlot) || (!appointmentDate && timeSlot)) {
                const response = BookAppointmentResponse.create({
                    success: false,
                    error: 'appointmentDate and timeSlot must be provided together.',
                });
                return callback(null, response);
            }

            // Add patient ID to the request data
            // Handle patientId validation and assignment
            const isPatient = user.role === UserRole.PATIENT;

            // Nếu là bệnh nhân → luôn set patientId = userId
            const patientId = isPatient ? user.userId : value.patientId;

            // Validate patientId
            const isInvalidPatientId =
                (!patientId) ||
                (!isPatient && !isValidUUID(patientId));

            if (isInvalidPatientId) {
                const response = BookAppointmentResponse.create({
                    success: false,
                    error: 'Invalid patient ID',
                });
                return callback(null, response);
            }

            // Build appointment data
            const appointmentData = {
                ...value,
                patientId,
            };


            //console.log(chalk.green(JSON.stringify(appointmentData)));

            const appointment = await this.appointmentService.bookAppointment(appointmentData);

            const response = BookAppointmentResponse.create({
                success: true,
                message: 'Appointment request submitted successfully. Waiting for doctor confirmation.',
                appointment: convertToAppointmentProto(appointment),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Book appointment handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async updateAppointment(
        call: grpc.ServerUnaryCall<UpdateAppointmentRequest, UpdateAppointmentResponse>,
        callback: grpc.sendUnaryData<UpdateAppointmentResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));

            if (!user || !user.userId) {
                const response = UpdateAppointmentResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = updateAppointmentSchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = UpdateAppointmentResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            // Validate timeSlot requirements
            const { appointmentDate, timeSlot } = value;
            if ((appointmentDate && !timeSlot) || (!appointmentDate && timeSlot)) {
                const response = UpdateAppointmentResponse.create({
                    success: false,
                    error: 'appointmentDate and timeSlot must be provided together.',
                });
                return callback(null, response);
            }

            // Check if appointment exists and get it for authorization
            const appointment = await this.appointmentService.getAppointmentById(value.appointmentId);
            if (!appointment) {
                const response = UpdateAppointmentResponse.create({
                    success: false,
                    error: 'Appointment not found',
                });
                return callback(null, response);
            }

            // Check if user has permission to update this appointment
            const isPatient = appointment.patientId === user.userId;
            const isDoctor = user.role === UserRole.DOCTOR && appointment.doctorId === user.userId;
            const isEmployee = user.role === UserRole.EMPLOYEE;
            const isAdmin = user.role === UserRole.ADMIN;

            if (!isPatient && !isDoctor && !isEmployee && !isAdmin) {
                const response = UpdateAppointmentResponse.create({
                    success: false,
                    error: 'Access denied. You can only update your own appointments.',
                });
                return callback(null, response);
            }

            const updatedAppointment = await this.appointmentService.updateAppointment(value, user.userId);

            const response = UpdateAppointmentResponse.create({
                success: true,
                message: 'Appointment updated successfully',
                appointment: convertToAppointmentProto(updatedAppointment),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Update appointment handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async acceptAppointment(
        call: grpc.ServerUnaryCall<AcceptAppointmentRequest, AcceptAppointmentResponse>,
        callback: grpc.sendUnaryData<AcceptAppointmentResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));

            if (!user || !user.userId) {
                const response = AcceptAppointmentResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = acceptAppointmentSchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = AcceptAppointmentResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            // Check if appointment exists and get it for authorization
            const appointment = await this.appointmentService.getAppointmentById(value.appointmentId);
            if (!appointment) {
                const response = AcceptAppointmentResponse.create({
                    success: false,
                    error: 'Appointment not found',
                });
                return callback(null, response);
            }

            // Check if the current user is the doctor for this appointment or an employee/admin
            const isDoctor = user.role === UserRole.DOCTOR && appointment.doctorId === user.userId;
            const isEmployee = user.role === UserRole.EMPLOYEE;
            const isAdmin = user.role === UserRole.ADMIN;

            if (!isDoctor && !isEmployee && !isAdmin) {
                const response = AcceptAppointmentResponse.create({
                    success: false,
                    error: 'Access denied. Only the assigned doctor or an employee can accept this appointment.',
                });
                return callback(null, response);
            }

            const acceptedAppointment = await this.appointmentService.acceptAppointment(value);

            const response = AcceptAppointmentResponse.create({
                success: true,
                message: 'Appointment confirmed successfully',
                appointment: convertToAppointmentProto(acceptedAppointment),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Accept appointment handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async cancelAppointment(
        call: grpc.ServerUnaryCall<CancelAppointmentRequest, CancelAppointmentResponse>,
        callback: grpc.sendUnaryData<CancelAppointmentResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);
            //console.log(chalk.green(JSON.stringify(user)));

            if (!user || !user.userId) {
                const response = CancelAppointmentResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = cancelAppointmentSchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = CancelAppointmentResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            // Check if appointment exists and get it for authorization
            const appointment = await this.appointmentService.getAppointmentById(value.appointmentId);
            if (!appointment) {
                const response = CancelAppointmentResponse.create({
                    success: false,
                    error: 'Appointment not found',
                });
                return callback(null, response);
            }

            // Check if user has permission to cancel this appointment
            const isPatient = appointment.patientId === user.userId;
            const isDoctor = user.role === UserRole.DOCTOR && appointment.doctorId === user.userId;
            const isEmployee = user.role === UserRole.EMPLOYEE;
            const isAdmin = user.role === UserRole.ADMIN;

            if (!isPatient && !isDoctor && !isEmployee && !isAdmin) {
                const response = CancelAppointmentResponse.create({
                    success: false,
                    error: 'Access denied. You can only cancel your own appointments.',
                });
                return callback(null, response);
            }

            const cancelledAppointment = await this.appointmentService.cancelAppointment(value);

            const response = CancelAppointmentResponse.create({
                success: true,
                message: 'Appointment cancelled successfully',
                appointment: convertToAppointmentProto(cancelledAppointment),
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Cancel appointment handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

    async getMyAppointments(
        call: grpc.ServerUnaryCall<GetMyAppointmentsRequest, GetMyAppointmentsResponse>,
        callback: grpc.sendUnaryData<GetMyAppointmentsResponse>
    ): Promise<void> {
        try {
            const user = getUserFromMetadata(call.metadata);

            if (!user || !user.userId || !user.role) {
                const response = GetMyAppointmentsResponse.create({
                    success: false,
                    error: 'Access denied',
                });
                return callback(null, response);
            }

            // Validate input using Joi
            const { error, value } = getMyAppointmentsSchema.validate(call.request, { convert: true, stripUnknown: true });
            if (error) {
                const response = GetMyAppointmentsResponse.create({
                    success: false,
                    error: error.details[0].message,
                });
                return callback(null, response);
            }

            // Check if user is trying to query for other users' appointments
            const isQueryingOtherUsers = value.userId || value.doctorId;

            // Only admin/employee can query for other users' appointments
            if (isQueryingOtherUsers && !['admin', 'employee'].includes(user.role.toLowerCase())) {
                const response = GetMyAppointmentsResponse.create({
                    success: false,
                    error: 'Insufficient permissions to query other users appointments',
                });
                return callback(null, response);
            }

            const result = await this.appointmentService.getMyAppointments(value, user.userId, user.role as UserRole);

            const response = GetMyAppointmentsResponse.create({
                success: true,
                message: 'Appointments retrieved successfully',
                appointments: result.data.map(appointment => convertToAppointmentProto(appointment)),
                pagination: {
                    page: result.pagination.page,
                    limit: result.pagination.limit,
                    total: result.pagination.total,
                    totalPages: result.pagination.totalPages
                }
            });

            callback(null, convertDateToTimestamps(response));
        } catch (error) {
            logger.error('Get my appointments handler error:', error);
            const err = handleGrpcError(error);
            callback(err, null);
        }
    }

}
