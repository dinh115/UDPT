import { Document, Types } from 'mongoose';

export enum DayOfWeek {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
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
    user: Types.ObjectId;
    specialization: string;
    experience: number;
    qualifications: string[];
    consultationFee: number;
    availability: IAvailability[];
    rating: number;
    //totalReviews: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDoctorInput {
    user: string;
    specialization: string;
    experience: number;
    qualifications: string[];
    consultationFee: number;
    availability: IAvailability[];
}