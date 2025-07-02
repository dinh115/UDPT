import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
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
                // UUID v4 validation regex
                return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
            },
            message: 'Patient ID must be a valid UUID v4'
        }
    },
    doctorId: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                // UUID v4 validation regex
                return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
            },
            message: 'Doctor ID must be a valid UUID v4'
        }
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