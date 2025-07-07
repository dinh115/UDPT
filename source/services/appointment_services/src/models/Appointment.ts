import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { IAppointment, AppointmentStatus } from '../types';

const timeSlotSchema = new Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    startTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
    },
    endTime: {
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
    }
});

const appointmentSchema = new Schema<IAppointment>({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    patientId: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return isUUID(v); // chấp nhận v1 → v5
            },
            message: 'Patient ID must be a valid UUID',
        },
    },
    doctorId: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return isUUID(v); // chấp nhận v1 → v5
            },
            message: 'Doctor ID must be a valid UUID',
        },
    },
    appointmentDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (date: Date) {
                // Allow past dates for completed appointments, but new appointments must be in future
                if (this.isNew) {
                    return date >= new Date();
                }
                return true;
            },
            message: 'New appointment date cannot be in the past'
        }
    },
    timeSlot: {
        type: timeSlotSchema,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.PENDING
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    }
}, {
    timestamps: true,
    _id: false
});

// Compound index to prevent double booking for confirmed appointments
appointmentSchema.index({
    doctorId: 1,
    appointmentDate: 1,
    'timeSlot.startTime': 1
}, {
    unique: true,
    partialFilterExpression: {
        status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED] }
    }
});

// Index for better query performance
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);