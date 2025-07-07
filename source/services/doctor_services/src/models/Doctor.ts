import mongoose, { Schema } from 'mongoose';
import { v5 as uuidv5, v4 as uuidv4, validate as isUUID } from 'uuid';
import { IDoctor, DayOfWeek } from '../types';

const NAMESPACE = '3f96061a-3a25-4f89-9ae9-abc012345678';

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
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const availabilitySchema = new Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    day: {
        type: String,
        enum: Object.values(DayOfWeek),
        required: true
    },
    slots: [timeSlotSchema]
}, { _id: false });

const doctorSchema = new Schema<IDoctor>({
    _id: {
        type: String,
        default: function () {
            return uuidv5(this.userId, NAMESPACE);
        },
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: string) {
                return isUUID(v); // chấp nhận v1 → v5
            },
            message: 'User ID must be a valid UUID',
        },
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true,
        maxlength: [100, 'Specialization cannot be more than 100 characters']
    },
    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [0, 'Experience cannot be negative'],
        max: [50, 'Experience cannot be more than 50 years']
    },
    qualifications: {
        type: [String],
        validate: {
            validator: function (qualifications: string[]) {
                return qualifications.length > 0;
            },
            message: 'At least one qualification is required'
        }
    },
    availability: [availabilitySchema]
}, {
    timestamps: true,
    _id: false
});

// Index for better query performance
doctorSchema.index({ specialization: 1, 'availability.day': 1 });

export default mongoose.model<IDoctor>('Doctor', doctorSchema);