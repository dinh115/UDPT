import { Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import { AuthRequest, ApiResponse } from '../types';
import { IAppointmentInput, AppointmentStatus } from '../types/appointment.types';

export class AppointmentController {
    static async bookAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { doctorId, appointmentDate, timeSlot, symptoms }: IAppointmentInput = req.body;
            const patientId = req.user!._id;

            // Find doctor and check if exists
            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Doctor not found'
                };
                res.status(404).json(response);
                return;
            }

            // Check if the appointment date is valid
            const appointmentDateTime = new Date(appointmentDate);
            if (appointmentDateTime <= new Date()) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Appointment date must be in the future'
                };
                res.status(400).json(response);
                return;
            }

            // Check if slot is available
            const existingAppointment = await Appointment.findOne({
                doctor: doctorId,
                appointmentDate: appointmentDateTime,
                'timeSlot.startTime': timeSlot.startTime,
                status: { $ne: AppointmentStatus.CANCELLED }
            });

            if (existingAppointment) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Time slot is not available'
                };
                res.status(400).json(response);
                return;
            }

            // Create new appointment
            const appointment = new Appointment({
                patient: patientId,
                doctor: doctorId,
                appointmentDate: appointmentDateTime,
                timeSlot,
                symptoms,
                consultationFee: doctor.consultationFee
            });

            await appointment.save();
            await appointment.populate(['patient', 'doctor']);

            const response: ApiResponse = {
                success: true,
                data: appointment,
                message: 'Appointment booked successfully'
            };
            res.status(201).json(response);
        } catch (error) {
            const err = error as Error;
            const response: ApiResponse = {
                success: false,
                message: 'Failed to book appointment',
                error: err.message
            };
            res.status(500).json(response);
        }
    }

    static async getMyAppointments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!._id;
            const { status, page = 1, limit = 10 } = req.query;

            const query: any = { patient: userId };
            if (status) {
                query.status = status;
            }

            const skip = (Number(page) - 1) * Number(limit);

            const appointments = await Appointment.find(query)
                .populate('doctor')
                .sort({ appointmentDate: -1 })
                .skip(skip)
                .limit(Number(limit));

            const total = await Appointment.countDocuments(query);

            const response: ApiResponse = {
                success: true,
                data: appointments,
                message: 'Appointments retrieved successfully'
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

            const appointment = await Appointment.findOne({
                _id: appointmentId,
                patient: userId
            });

            if (!appointment) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Appointment not found'
                };
                res.status(404).json(response);
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

            appointment.status = AppointmentStatus.CANCELLED;
            await appointment.save();

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