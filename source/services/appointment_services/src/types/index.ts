// Express Request extension
import { Document } from "mongoose";

export const roles = ['patient', 'admin', 'doctor', 'employee'] as const;
export type Role = (typeof roles)[number];

export const statuses = ['active', 'inactive'] as const;
export type Status = (typeof statuses)[number];

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    EMPLOYEE = 'employee',
    ADMIN = 'admin'
}

export interface IUser extends Document {
    _id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

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
    patientId: string;
    doctorId: string;
    appointmentDate: Date;
    timeSlot: ITimeSlotInput;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface IAppointmentInput {
    patientId: string,
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