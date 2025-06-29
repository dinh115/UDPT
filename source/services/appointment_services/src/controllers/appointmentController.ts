import { Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { IAppointmentInput, IAppointmentUpdateInput, AppointmentStatus } from '../types/appointment.types'
import { UserRole } from '../types/user.types'
import { UtilHelper } from '../utils';

export class AppointmentController {
    static async bookAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId, appointmentDate, timeSlot, notes }: IAppointmentInput = req.body;
            const userId = req.user!._id;

            if ((appointmentDate && !timeSlot) || (!appointmentDate && timeSlot)) {
                const response: ApiResponse = {
                    success: false,
                    message: 'appointmentDate and timeSlot must be provided together.'
                };
                res.status(400).json(response);
                return;
            }
            // Find doctor and check if exists
            const doctor = await UtilHelper.getDoctorOrRespond(doctorId, res);
            if (!doctor) return;

            // Check if the appointment date is valid
            const appointmentDateTime = UtilHelper.getDateOrResponse(appointmentDate, res);
            if (!appointmentDateTime) return;

            // Check if the requested time slot is available in doctor's schedule
            const availableSlot = await UtilHelper.getSlotOrResponse(doctorId, appointmentDateTime, timeSlot, res)
            if (!availableSlot) return;
            
            // Check if user already has an appointment at this time
            const isUserConflict = await UtilHelper.isUserTimeConflictResponse({
                patient: userId,
                appointmentDate: appointmentDateTime,
                startTime: timeSlot.startTime,
                status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
            }, res)
            if (isUserConflict) return;

            // Create new appointment with PENDING status
            const appointment = new Appointment({
                patient: userId,
                doctor: doctorId,
                appointmentDate: appointmentDateTime,
                timeSlot: {
                    startTime: timeSlot.startTime,
                    endTime: timeSlot.endTime
                },
                notes
            });

            await appointment.save();
            await appointment.populate({
                path: 'doctor',
                select: 'user',
                populate: {
                    path: 'user',
                    select: 'name email phone'
                }
            });

            await appointment.populate({
                path: 'patient',
                select: 'name email phone'
            });

            const response: ApiResponse = {
                success: true,
                data: appointment,
                message: 'Appointment request submitted successfully. Waiting for doctor confirmation.'
            };
            res.status(201).json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to book appointment',
                error: err.message
            };
            res.status(err.message === 'Doctor not found' ? 404 : 500).json(response);
        }
    }

    static async updateAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            const { appointmentDate, timeSlot, notes }: IAppointmentUpdateInput = req.body;

            if ((appointmentDate && !timeSlot) || (!appointmentDate && timeSlot)) {
                const response: ApiResponse = {
                    success: false,
                    message: 'appointmentDate and timeSlot must be provided together.'
                };
                res.status(400).json(response);
                return;
            }

            const userId = req.user!._id;
            const userRole = req.user!.role;

            // Check if appointment exists
            const appointment = await UtilHelper.getAppointmentOrResponse(appointmentId, res);
            if (!appointment) return;

            const doctorId = appointment.doctor._id.toString();

            // Check if user has permission to update this appointment
            const isPatient = appointment.patient._id.toString() === userId.toString();
            const isDoctor = userRole === UserRole.DOCTOR &&
                appointment.doctor._id.toString() === userId.toString();
            const isEmployee = userRole === UserRole.EMPLOYEE;
            const isAdmin = userRole === UserRole.ADMIN;
            if (!isPatient && !isDoctor && !isEmployee && !isAdmin) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Access denied. You can only update your own appointments.'
                };
                res.status(403).json(response);
                return;
            }

            // Check if appointment can be updated
            if (appointment.status === AppointmentStatus.CONFIRMED) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Cannot update confirmed appointment. Please cancel and create a new one.'
                };
                res.status(400).json(response);
                return;
            }

            if (appointment.status === AppointmentStatus.COMPLETED) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Cannot update completed appointment'
                };
                res.status(400).json(response);
                return;
            }

            if (appointment.status === AppointmentStatus.CANCELLED) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Cannot update cancelled appointment'
                };
                res.status(400).json(response);
                return;
            }

            // Find doctor and check if exists
            const doctor = await UtilHelper.getDoctorOrRespond(doctorId, res);
            if (!doctor) return;

            // Update appointment fields
            if (appointmentDate) {
                // Check if the appointment date is valid
                const newDateTime = UtilHelper.getDateOrResponse(appointmentDate, res);
                if (!newDateTime) return;

                // Check if the time slot exists
                if (timeSlot) {
                    // Check if the requested time slot is available in doctor's schedule
                    const availableSlot = await UtilHelper.getSlotOrResponse(doctorId, newDateTime, timeSlot, res)
                    if (!availableSlot) return;

                    // Check if user already has an appointment at this time
                    const isUserConflict = await UtilHelper.isUserTimeConflictResponse({
                        patient: userId,
                        appointmentDate: newDateTime,
                        startTime: timeSlot.startTime,
                        status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
                    }, res)
                    if (isUserConflict) return;

                    //Update the timeslot
                    appointment.appointmentDate = newDateTime;
                    appointment.timeSlot = timeSlot;
                }
            }

            if (notes !== undefined) {
                appointment.notes = notes;
            }

            await appointment.save();
            await appointment.populate({
                path: 'doctor',
                select: 'user', // don’t return doctor fields
                populate: {
                    path: 'user',
                    select: 'name email phone'
                }
            });

            await appointment.populate({
                path: 'patient',
                select: 'name email phone' // exclude password, role, timestamps, etc.
            });

            const response: ApiResponse = {
                success: true,
                data: appointment,
                message: 'Appointment updated successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to update appointment',
                error: err.message
            };
            res.status(err.message === 'Doctor not found' ? 404 : 500).json(response);
        }
    }

    static async acceptAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            const userId = req.user!._id;
            const userRole = req.user!.role;

            // Check if appointment exists
            const appointment = await UtilHelper.getAppointmentOrResponse(appointmentId, res);
            if (!appointment) return;

            // Check if the current user is the doctor for this appointment or an employee, admin
            const isDoctor = appointment.doctor._id.toString() !== userId.toString() && userRole === UserRole.DOCTOR;
            const isEmployee = userRole === UserRole.EMPLOYEE;
            const isAdmin = userRole === UserRole.ADMIN;
            if (!isDoctor && !isEmployee && !isAdmin) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Access denied. Only the assigned doctor or an employee can accept this appointment.'
                };
                res.status(403).json(response);
                return;
            }

            // Check if appointment is in pending status
            if (appointment.status !== AppointmentStatus.PENDING) {
                const response: ApiResponse = {
                    success: false,
                    message: `Cannot accept appointment. Current status: ${appointment.status}`
                };
                res.status(400).json(response);
                return;
            }

            // Check for time slot conflicts with other confirmed appointments
            const conflictingAppointment = await Appointment.findOne({
                _id: { $ne: appointmentId },
                doctor: appointment.doctor._id,
                appointmentDate: appointment.appointmentDate,
                'timeSlot.startTime': appointment.timeSlot.startTime,
                status: { $in: [AppointmentStatus.CONFIRMED] }
            });

            if (conflictingAppointment) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Time slot conflict detected. Please reschedule.'
                };
                res.status(400).json(response);
                return;
            }

            // Mark the slot as booked
            const isSlotUpdated = await UtilHelper.updateSlotBookingStatus(
                appointment.doctor._id.toString(),
                appointment.appointmentDate,
                appointment.timeSlot,
                true // Mark as booked
            );
            if (!isSlotUpdated) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Fail to update time slot status.'
                };
                res.status(500).json(response);
                return;
            }

            // Find all other pending appointments with the same doctor and time slot
            const conflictingPendingAppointments = await Appointment.find({
                _id: { $ne: appointmentId },
                doctor: appointment.doctor._id,
                appointmentDate: appointment.appointmentDate,
                'timeSlot.startTime': appointment.timeSlot.startTime,
                status: AppointmentStatus.PENDING
            });

            // Cancel all conflicting pending appointments
            if (conflictingPendingAppointments.length > 0) {
                await Appointment.updateMany(
                    {
                        _id: { $in: conflictingPendingAppointments.map(apt => apt._id) }
                    },
                    {
                        status: AppointmentStatus.CANCELLED
                    }
                );
                //console.log(`Cancelled ${conflictingPendingAppointments.length} conflicting appointments`);
            }

            // Accept the appointment
            appointment.status = AppointmentStatus.CONFIRMED;
            await appointment.save();
            await appointment.populate({
                path: 'doctor',
                select: 'user', // don’t return doctor fields
                populate: {
                    path: 'user',
                    select: 'name email phone'
                }
            });

            await appointment.populate({
                path: 'patient',
                select: 'name email phone' // exclude password, role, timestamps, etc.
            });

            const response: ApiResponse = {
                success: true,
                data: appointment,
                message: 'Appointment confirmed successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to accept appointment',
                error: err.message
            };
            res.status(500).json(response);
        }
    }

    static async getMyAppointments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!._id;
            const userRole = req.user!.role;
            const { status, page = 1, limit = 10 } = req.query;

            let query: any = {};

            // Build query based on user role
            if (userRole === UserRole.DOCTOR) {
                // For doctors, find appointments through doctor profile
                const doctor = await UtilHelper.getDoctorOrRespond(userId.toString(), res);
                if (!doctor) return;
                query.doctor = doctor._id;
            } else if (userRole === UserRole.PATIENT) {
                // For patients
                query.patient = userId;
            }

            if (status) {
                query.status = status;
            }

            const skip = (Number(page) - 1) * Number(limit);

            const appointments = await Appointment.find(query)
                .populate('patient', 'name email phone')
                .populate({
                    path: 'doctor',
                    select: 'user',
                    populate: {
                        path: 'user',
                        select: 'name email phone'
                    }
                })
                .sort({ appointmentDate: -1 })
                .skip(skip)
                .limit(Number(limit));

            const total = await Appointment.countDocuments(query);

            console.log(appointments);

            const response: PaginatedResponse<typeof appointments[0]> = {
                success: true,
                data: appointments,
                message: 'Appointments retrieved successfully',
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to retrieve appointments',
                error: err.message
            };
            res.status(500).json(response);
        }
    }


    static async cancelAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            const userId = req.user!._id;
            const userRole = req.user!.role;

            const appointment = await UtilHelper.getAppointmentOrResponse(appointmentId, res);
            if (!appointment) return;

            const doctor = await UtilHelper.getDoctorOrRespond(appointment.doctor._id.toString(), res);
            if (!doctor) return;

            console.log(doctor.user._id.toString());
            console.log(userId.toString());
            // Check if user has permission to cancel this appointment
            const isPatient = appointment.patient._id.toString() === userId.toString();
            const isDoctor = userRole === UserRole.DOCTOR && doctor.user._id.equals(req.user?._id);
            const isEmployee = userRole === UserRole.EMPLOYEE;
            const isAdmin = userRole === UserRole.ADMIN;

            if (!isPatient && !isDoctor && !isEmployee && !isAdmin) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Access denied. You can only cancel your own appointments.'
                };
                res.status(403).json(response);
                return;
            }

            if (appointment.status === AppointmentStatus.COMPLETED) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Cannot cancel completed appointment'
                };
                res.status(400).json(response);
                return;
            }

            if (appointment.status === AppointmentStatus.CANCELLED) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Appointment is already cancelled'
                };
                res.status(400).json(response);
                return;
            }

            // Free up the time slot when cancelling
            await UtilHelper.updateSlotBookingStatus(
                appointment.doctor._id.toString(),
                appointment.appointmentDate,
                appointment.timeSlot,
                false // Mark as not booked
            );

            appointment.status = AppointmentStatus.CANCELLED;
            await appointment.save();

            await appointment.populate({
                path: 'doctor',
                select: 'user',
                populate: {
                    path: 'user',
                    select: 'name email phone'
                }
            });

            await appointment.populate({
                path: 'patient',
                select: 'name email phone'
            });

            const response: ApiResponse = {
                success: true,
                data: appointment,
                message: 'Appointment cancelled successfully'
            };
            res.json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to cancel appointment',
                error: err.message
            };
            res.status(500).json(response);
        }
    }
}