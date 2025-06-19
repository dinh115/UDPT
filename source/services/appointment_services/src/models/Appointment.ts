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
    timestamps: true
});

// Compound index to prevent double booking for confirmed appointments
appointmentSchema.index({
    doctor: 1,
    appointmentDate: 1,
    'timeSlot.startTime': 1
}, {
    unique: true,
    partialFilterExpression: {
        status: { $in: [AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED] }
    }
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);