import { Document } from 'mongoose';

export const roles = ['patient', 'admin', 'doctor', 'employee'] as const;
export type Role = (typeof roles)[number];

export const statuses = ['active', 'inactive'] as const;
export type Status = (typeof statuses)[number];

// export enum UserRole {
//     PATIENT = 'patient',
//     DOCTOR = 'doctor',
//     EMPLOYEE = 'employee',
//     ADMIN = 'admin'
// }

export interface JWTPayload {
    userId: string;
    email: string;
    username: string;
    role: string;
    status: string;
}

export interface ITimeSlotInput {
    startTime: string;
    endTime: string;
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


export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface ITimeSlot {
    startTime: string;
    endTime: string;
    isBooked: boolean;
}


export interface IAvailability {
    day: DayOfWeek;
    slots: ITimeSlot[];
}

export interface IDoctor extends Document {
    _id: string;
    userId: string;
    specialization: string;
    experience: number;
    qualifications: string[];
    availability: IAvailability[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IDoctorInput {
    userId: string;
    specialization: string;
    experience: number;
    qualifications: string[];
    availability: IAvailability[];
}

export interface FindDoctorOptions {
    page: number;
    limit: number;
    specialization?: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface FindDoctorResult {
    doctors: IDoctor[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}