import { Document, Types } from 'mongoose';

export enum UserRole {
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    EMPLOYEE = 'employee',
    ADMIN = 'admin'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    dateOfBirth?: Date;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;
}

export interface IUserInput {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: UserRole;
    dateOfBirth?: Date;
    address?: string;
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}

export type UserDocument = Document<unknown, {}, IUser> & IUser & {
    _id: Types.ObjectId;
};