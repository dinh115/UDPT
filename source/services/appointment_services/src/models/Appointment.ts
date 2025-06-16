import mongoose, { Schema } from 'mongoose';
import { IAppointment, AppointmentStatus } from '../types/appointment.types';

const timeSlotSchema = new Schema({
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
}, { _id: false });

const appointmentSchema = new Schema<IAppointment>({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (date: Date) {
                return date >= new Date();
            },
            message: 'Appointment date cannot be in the past'
        }
    },
    timeSlot: {
        type: timeSlotSchema,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.SCHEDULED
    },
    symptoms: {
        type: String,
        maxlength: [500, 'Symptoms cannot be more than 500 characters']
    },
    diagnosis: {
        type: String,
        maxlength: [1000, 'Diagnosis cannot be more than 1000 characters']
    },
    prescription: {
        type: String,
        maxlength: [1000, 'Prescription cannot be more than 1000 characters']
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters']
    },
    consultationFee: {
        type: Number,
        required: true,
        min: [0, 'Consultation fee cannot be negative']
    }
}, {
    timestamps: true
});

// Compound index to prevent double booking
appointmentSchema.index({
    doctor: 1,
    appointmentDate: 1,
    'timeSlot.startTime': 1
}, {
    unique: true,
    partialFilterExpression: {
        status: { $ne: AppointmentStatus.CANCELLED }
    }
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);