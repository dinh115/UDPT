import logger from '../config/logger';
import Appointment from '../models/Appointment';
import { AcceptAppointmentRequest, CancelAppointmentRequest, GetMyAppointmentsRequest, UpdateAppointmentRequest } from '../proto/generated/appointment';
import { ApiResponse, AuthRequest } from '../types';
import {
    UserRole,
    IAppointmentInput,
    IAppointmentUpdateInput,
    AppointmentStatus,
    ITimeSlotInput
    // ITimeSlot, DayOfWeek 
} from '../types';

import { DoctorServiceManager } from './doctorServiceClient'

interface usersTimeConflictInput {
    patientId: string,
    appointmentDate: string,
    startTime: string,
    status?: {
        $in: AppointmentStatus[];
    };
}

export class AppointmentService {

    private doctorService = DoctorServiceManager.getInstance();

    async isUserTimeConflict(data: usersTimeConflictInput) {
        try {
            const existingAppointment = await Appointment.findOne({
                patientId: data.patientId,
                appointmentDate: data.appointmentDate,
                'timeSlot.startTime': data.startTime,
                status: data.status
            });

            // Return true if conflict (an appointment already exists)
            // Return false if no conflict (no appointment exists)
            return existingAppointment !== null;
        }
        catch (error) {
            logger.error('Check time conflict error: ', error);
            throw error;
        }
    }

    public async getAppointmentById(appointmentId: string) {

        try {
            const appointment = await Appointment.findById(appointmentId);
            return appointment;
        }
        catch (error) {
            logger.error('Get appointment by ID error:', error);
            throw error;
        }
    }

    async bookAppointment(data: IAppointmentInput) {
        try {
            const { patientId, doctorId, appointmentDate, timeSlot, notes }: IAppointmentInput = data;

            // Find doctor and check if exists
            const doctorResponse = await this.doctorService.getDoctorByIdInternal({ doctorId });
            if (!doctorResponse.success) throw new Error('Doctor not found');

            // Check if the requested time slot is available in doctor's schedule
            const slotsResponse = await this.doctorService.getSlotsInternal({ doctorId, date: appointmentDate })
            if (!slotsResponse.success) throw new Error('Cannot get doctor\'s time slots');
            const availableSlots = slotsResponse.slots

            // Check if timeSlot exists in availableSlots
            const isSlotAvailable = availableSlots.some(
                (slot) =>
                    slot.startTime.trim() === timeSlot.startTime.trim() &&
                    slot.endTime.trim() === timeSlot.endTime.trim() &&
                    !slot.isBooked
            );

            if (!isSlotAvailable) {
                throw new Error('Time slot is not available');
            }

            // Check if user already has an appointment at this time
            const isUserConflict = await this.isUserTimeConflict({
                patientId: patientId,
                appointmentDate: appointmentDate,
                startTime: timeSlot.startTime,
                status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
            })
            if (isUserConflict) throw new Error('Patient has an appointment at this time.');

            // Create new appointment with PENDING status
            const appointment = new Appointment({
                patientId: patientId,
                doctorId: doctorId,
                appointmentDate: appointmentDate,
                timeSlot: {
                    startTime: timeSlot.startTime,
                    endTime: timeSlot.endTime
                },
                notes,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await appointment.save();
            return appointment;
        } catch (error) {
            logger.error('Book appointment error:', error);
            throw error;
        }
    }

    async updateAppointment(data: UpdateAppointmentRequest, patientId: string) {
        try {
            const { appointmentId, appointmentDate, timeSlot, notes } = data;

            if ((appointmentDate && !timeSlot) || (!appointmentDate && timeSlot)) {
                throw new Error('appointmentDate and timeSlot must be provided together.');
            }

            // Check if appointment exists
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) throw new Error('Appointment not found');

            const doctorId = appointment.doctorId;

            // Check if appointment can be updated
            if (appointment.status === AppointmentStatus.CONFIRMED) {
                throw new Error('Cannot update CONFIRMED appointment.');
            }

            if (appointment.status === AppointmentStatus.COMPLETED) {
                throw new Error('Cannot update COMPLETED appointment.');
            }

            if (appointment.status === AppointmentStatus.CANCELLED) {
                throw new Error('Cannot update CANCELLED appointment.');
            }

            // Find doctor and check if exists
            const doctorResponse = await this.doctorService.getDoctorByIdInternal({ doctorId });
            if (!doctorResponse.success) {
                throw new Error('Doctor not found');
            }

            // Update appointment fields
            if (appointmentDate && timeSlot) {
                // Check if the appointment date is valid
                const newDateTime = appointmentDate;

                // Check if the time slot exists
                const slotsResponse = await this.doctorService.getSlotsInternal({ doctorId, date: appointmentDate.toString() });
                if (!slotsResponse.success) {
                    throw new Error('Could not fetch doctor slots');
                }
                const availableSlots = slotsResponse.slots;
                // Check if the requested time slot is available in doctor's schedule
                const isSlotAvailable = availableSlots.some(
                    (slot) =>
                        slot.startTime === timeSlot.startTime &&
                        slot.endTime === timeSlot.endTime
                );

                if (!isSlotAvailable) {
                    throw new Error('Time slot is not available');
                }

                // Check if user already has an appointment at this time
                const isUserConflict = await this.isUserTimeConflict({
                    patientId: patientId,
                    appointmentDate: newDateTime.toString(),
                    startTime: timeSlot.startTime,
                    status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] }
                });
                if (isUserConflict) throw new Error('Patient is busy at that time slot.');

                //Update the timeslot
                appointment.appointmentDate = new Date(newDateTime);
                appointment.timeSlot = timeSlot;
            }

            if (notes !== undefined) {
                appointment.notes = notes;
            }
            appointment.updatedAt = new Date();
            await appointment.save();
            return appointment;
        } catch (error) {
            logger.error('Update appointment error:', error);
            throw error;
        }
    }

    async getDoctorIdByUserId(userId: string) {
        try {
            return (await this.doctorService.getDoctorByUserIdInternal({ userId })).doctor?.id;
        }
        catch (error) {
            logger.error('Get doctor id by user id error:', error);
            throw error;
        }
    }

    async acceptAppointment(data: AcceptAppointmentRequest) {
        try {
            const { appointmentId } = data;

            // Check if appointment exists
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) throw new Error('Appointment not found');
            // Check if appointment is in pending status

            if (appointment.status !== AppointmentStatus.PENDING)
                throw new Error(`Cannot accept appointment. Current status: ${appointment.status}`);

            // Check for time slot conflicts with other confirmed appointments
            const conflictingAppointment = await Appointment.findOne({
                _id: { $ne: appointmentId },
                doctorId: appointment.doctorId,
                appointmentDate: appointment.appointmentDate,
                'timeSlot.startTime': appointment.timeSlot.startTime,
                status: { $in: [AppointmentStatus.CONFIRMED] }
            });

            if (conflictingAppointment) throw new Error('Time slot conflict detected. Please reschedule.');

            // Mark the slot as booked
            const isSlotUpdated = await this.doctorService.updateSlotBookingStatusInternal({
                doctorId: appointment.doctorId,
                appointmentDate: appointment.appointmentDate.toISOString().split('T')[0],
                timeSlot: appointment.timeSlot,
                isBooked: true // Mark as booked
            });
            if (!isSlotUpdated.success) throw new Error('Failed to update doctor\'s time slot status');

            // Find all other pending appointments with the same doctor and time slot
            const conflictingPendingAppointments = await Appointment.find({
                _id: { $ne: appointmentId },
                doctor: appointment.doctorId,
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

            return appointment;
        } catch (error) {
            logger.error('Accept appointment error:', error);
            throw error;
        }
    }

    async getMyAppointments(data: GetMyAppointmentsRequest, userId: string, userRole: UserRole) {
        try {
            const { status, page = 1, limit = 10 } = data;

            let query: any = {};

            // Build query based on user role
            if (userRole === UserRole.DOCTOR) {
                // For doctors, find appointments through doctor profile
                const doctorResponse = await this.doctorService.getDoctorByUserIdInternal({ userId });
                if (!doctorResponse.success) throw new Error('Doctor not found');
                query.doctorId = doctorResponse.doctor?.id;
            } else if (userRole === UserRole.PATIENT) {
                // For patients, 
                query.patientId = userId;
            }
            if (status) {
                query.status = status;
            }

            const skip = (Number(page) - 1) * Number(limit);

            const appointments = await Appointment.find(query)
                .sort({ appointmentDate: -1 })
                .skip(skip)
                .limit(Number(limit));

            const total = await Appointment.countDocuments(query);

            //console.log(appointments);

            return {
                data: appointments,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            };
        } catch (error) {
            logger.error('Get my appointments error:', error);
            throw error;
        }
    }

    async cancelAppointment(data: CancelAppointmentRequest) {
        try {
            const { appointmentId } = data;

            const appointment = await Appointment.findById(appointmentId)
            if (!appointment) throw new Error('Appointment not found');

            const doctorResponse = await this.doctorService.getDoctorByIdInternal({ doctorId: appointment.doctorId });
            if (!doctorResponse.success) throw new Error('Doctor not found');


            if (appointment.status === AppointmentStatus.COMPLETED)
                throw new Error('Cannot cancel COMPLETED appointment');

            if (appointment.status === AppointmentStatus.CANCELLED)
                throw new Error('Cannot cancel CANCELLED appointment');


            // Free up the time slot when cancelling
            const isSlotUpdated = await this.doctorService.updateSlotBookingStatusInternal(
                {
                    doctorId: appointment.doctorId,
                    appointmentDate: appointment.appointmentDate.toISOString().split('T')[0],
                    timeSlot: appointment.timeSlot,
                    isBooked: Boolean(false) // Mark as not booked
                }
            );
            if (!isSlotUpdated.success) throw new Error('Failed to update doctor\'s time slot status');


            appointment.status = AppointmentStatus.CANCELLED;
            await appointment.save();

            return appointment;
        } catch (error) {
            logger.error('Cancel appointment error:', error);
            throw error;
        }
    }
}
