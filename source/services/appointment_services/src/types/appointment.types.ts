import { Document, Types } from 'mongoose';

export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no-show'
}

export interface ITimeSlot {
    startTime: string;
    endTime: string;
}

export interface IAppointment extends Document {
    patient: Types.ObjectId;
    doctor: Types.ObjectId;
    appointmentDate: Date;
    timeSlot: ITimeSlot;
    status: AppointmentStatus;
    symptoms?: string;
    diagnosis?: string;
    prescription?: string;
    notes?: string;
    consultationFee: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAppointmentInput {
    doctorId: string;
    appointmentDate: string;
    timeSlot: ITimeSlot;
    symptoms?: string;
}