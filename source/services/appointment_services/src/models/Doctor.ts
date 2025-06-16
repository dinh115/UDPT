import mongoose, { Schema } from 'mongoose';
import { IDoctor, DayOfWeek } from '../types/doctor.types';

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
    },
    isBooked: { type: Boolean, default: false }
});

const availabilitySchema = new Schema({
    day: {
        type: String,
        enum: Object.values(DayOfWeek),
        required: true
    },
    slots: [timeSlotSchema]
});

const doctorSchema = new Schema<IDoctor>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
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
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required'],
        min: [0, 'Consultation fee cannot be negative']
    },
    availability: [availabilitySchema],
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    // totalReviews: {
    //     type: Number,
    //     default: 0,
    //     min: [0, 'Total reviews cannot be negative']
    // }
}, {
    timestamps: true
});

// Index for better query performance
doctorSchema.index({ specialization: 1, 'availability.day': 1 });
doctorSchema.index({ rating: -1 });

export default mongoose.model<IDoctor>('Doctor', doctorSchema);