import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';
import { IAppointmentInput, IAppointmentUpdateInput, AppointmentStatus, ITimeSlotInput } from '../types/appointment.types'
import { ITimeSlot, DayOfWeek } from "../types/doctor.types";
import { ApiResponse, AuthRequest } from '../types';
import { Response } from "express";
import { Types } from 'mongoose';
import { UserRole } from "../types/user.types";

interface usersTimeConflictInput {
    patient: Types.ObjectId,
    appointmentDate: Date,
    startTime: string,
    status?: {
        $in: AppointmentStatus[];
    };
}

export class UtilHelper {

    public static isAdmin(req: AuthRequest): boolean {
        return req.user?.role === UserRole.ADMIN;
    }

    public static isEmployee(req: AuthRequest): boolean {
        return req.user?.role === UserRole.EMPLOYEE;
    }

    public static isDoctor(req: AuthRequest): boolean {
        return req.user?.role === UserRole.DOCTOR;
    }

    // Helper method to get day of week from date
    public static getDayOfWeek(date: Date): DayOfWeek {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()] as DayOfWeek;
    }

    // Helper method to find and update slot booking status
    public static async updateSlotBookingStatus(
        doctorId: string,
        appointmentDate: Date,
        timeSlot: ITimeSlotInput,
        isBooked: boolean
    ): Promise<boolean> {
        const dayOfWeek = this.getDayOfWeek(appointmentDate);

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return false;

        const dayAvailability = doctor.availability.find(avail => avail.day === dayOfWeek);
        if (!dayAvailability) return false;

        const slot = dayAvailability.slots.find(s =>
            s.startTime === timeSlot.startTime && s.endTime === timeSlot.endTime
        );

        if (!slot) return false;

        slot.isBooked = isBooked;
        await doctor.save();
        return true;
    }

    public static async getDoctorAvailableSlots(doctorId: string, date: string) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const requestedDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(requestedDate);

        const dayAvailability = doctor.availability.find(avail => avail.day === dayOfWeek);
        if (!dayAvailability) {
            throw new Error('Doctor is not available on this day');
        }

        return dayAvailability.slots.filter(slot => !slot.isBooked);
    }

    public static async getDoctorOrRespond(doctorId: string, res: Response) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
            return null;
        }
        return doctor;
    }

    public static async getSlotsOrResponse(doctorId: string, date: Date, res: Response) {
        const availableSlots = await this.getDoctorAvailableSlots(doctorId, date.toString())
        if (!availableSlots) {
            const response: ApiResponse = {
                success: false,
                message: 'Time slot is not available or already booked'
            };
            res.status(400).json(response);
            return null;
        }
        return availableSlots;
    }

    public static async getSlotOrResponse(doctorId: string, date: Date, slot: ITimeSlotInput, res: Response) {
        const availableSlots = await this.getSlotsOrResponse(doctorId, date, res)
        if (!availableSlots) return;

        const availableSlot = availableSlots.find(s => s.startTime === slot.startTime && s.endTime === slot.endTime);
        if (!availableSlot) {
            const response: ApiResponse = {
                success: false,
                message: 'Time slot is not available or already booked'
            };
            res.status(400).json(response);
            return null;
        }
        return availableSlot;
    }
    public static getDateOrResponse(appointmentDate: string, res: Response) {
        const appointmentDateTime = new Date(appointmentDate);
        if (appointmentDateTime <= new Date()) {
            const response: ApiResponse = {
                success: false,
                message: 'Appointment date must be in the future'
            };
            res.status(400).json(response);
            return null;
        }
        return appointmentDateTime;
    }

    public static async isUserTimeConflictResponse(data: usersTimeConflictInput, res: Response) {
        const usersAppointment = await Appointment.findOne({
            patient: data.patient,
            appointmentDate: data.appointmentDate,
            'timeSlot.startTime': data.startTime,
            status: data.status
        });

        if (usersAppointment) {
            const response: ApiResponse = {
                success: false,
                message: 'You already have an appointment at this time'
            };
            res.status(400).json(response);
            return true;
        }
        return false; // Not exist => not conflict => True 
    }

    public static async getAppointmentOrResponse(appointmentId: string, res: Response) {
        const appointment = await Appointment.findById(appointmentId)
            .populate('patient')
            .populate('doctor');
        if (!appointment) {
            const response: ApiResponse = {
                success: false,
                message: 'Appointment not found'
            };
            res.status(404).json(response);
            return null;
        }
        return appointment;
    }

    public static generateTimeSlots(startTime: string, endTime: string): ITimeSlot[] {
        const slots: ITimeSlot[] = [];

        // Parse start and end times
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMin;
        const endTotalMinutes = endHour * 60 + endMin;

        // Generate 30-minute slots
        const gap = Number(process.env.TIMESLOT_GAP) || 30;
        for (let currentMinutes = startTotalMinutes; currentMinutes < endTotalMinutes; currentMinutes += gap) {
            const nextMinutes = currentMinutes + gap;

            // Don't create a slot if it would exceed the end time
            if (nextMinutes > endTotalMinutes) break;

            const currentHour = Math.floor(currentMinutes / 60);
            const currentMin = currentMinutes % 60;
            const nextHour = Math.floor(nextMinutes / 60);
            const nextMinute = nextMinutes % 60;

            const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
            const slotEnd = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;

            slots.push({
                startTime: slotStart,
                endTime: slotEnd,
                isBooked: false
            });
        }

        return slots;
    }

    // Helper method to convert existing time ranges to 30-minute slots
    public static convertToAutoSlots(originalSlots: ITimeSlot[]): ITimeSlot[] {
        const autoGeneratedSlots: ITimeSlot[] = [];

        for (const slot of originalSlots) {
            const generatedSlots = this.generateTimeSlots(slot.startTime, slot.endTime);
            autoGeneratedSlots.push(...generatedSlots);
        }

        return autoGeneratedSlots;
    }

    // Helper to process doctor availability and auto-generate slots
    public static async processAndSaveDoctorAvailability(doctorId: string, availability: any[]) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) throw new Error('Doctor not found');

        // Process each availability entry
        const processedAvailability = availability.map(avail => ({
            day: avail.day,
            slots: this.convertToAutoSlots(avail.slots)
        }));

        doctor.availability = processedAvailability;
        await doctor.save();

        return doctor;
    }

    // Get time slot statistics for a doctor
    public static async getDoctorSlotStatistics(doctorId: string, date?: string) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) throw new Error('Doctor not found');

        if (date) {
            // Get statistics for a specific date
            const requestedDate = new Date(date);
            const dayOfWeek = this.getDayOfWeek(requestedDate);
            const dayAvailability = doctor.availability.find(avail => avail.day === dayOfWeek);

            if (!dayAvailability) {
                return {
                    date,
                    dayOfWeek,
                    totalSlots: 0,
                    availableSlots: 0,
                    bookedSlots: 0
                };
            }

            const totalSlots = dayAvailability.slots.length;
            const bookedSlots = dayAvailability.slots.filter(slot => slot.isBooked).length;
            const availableSlots = totalSlots - bookedSlots;

            return {
                date,
                dayOfWeek,
                totalSlots,
                availableSlots,
                bookedSlots
            };
        } else {
            // Get overall statistics for all days
            const weeklyStats = doctor.availability.map(avail => {
                const totalSlots = avail.slots.length;
                const bookedSlots = avail.slots.filter(slot => slot.isBooked).length;
                const availableSlots = totalSlots - bookedSlots;

                return {
                    day: avail.day,
                    totalSlots,
                    availableSlots,
                    bookedSlots
                };
            });

            const overallStats = weeklyStats.reduce((acc, day) => ({
                totalSlots: acc.totalSlots + day.totalSlots,
                availableSlots: acc.availableSlots + day.availableSlots,
                bookedSlots: acc.bookedSlots + day.bookedSlots
            }), { totalSlots: 0, availableSlots: 0, bookedSlots: 0 });

            return {
                weekly: weeklyStats,
                overall: overallStats
            };
        }
    }
}
