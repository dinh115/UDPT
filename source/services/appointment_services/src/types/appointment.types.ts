import { Document, Types } from 'mongoose';

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no-show'
}

export interface ITimeSlotInput {
    startTime: string;
    endTime: string;
}

export interface IAppointment extends Document {
    patient: Types.ObjectId;
    doctor: Types.ObjectId;
    appointmentDate: Date;
    timeSlot: ITimeSlotInput;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface IAppointmentInput {
    doctorId: string;
    appointmentDate: string;
    timeSlot: ITimeSlotInput;
    notes?: string;
}


export interface IAppointmentUpdateInput {
    appointmentDate?: string;
    timeSlot?: ITimeSlotInput;
    notes?: string;
}