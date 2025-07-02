import mongoose, { Schema, Document } from 'mongoose';
import { IUser, statuses, roles } from '../types';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema<IUser>({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                // Basic phone regex - adjust as needed for your requirements
                return /^[\+]?[1-9][\d]{0,15}$/.test(v);
            },
            message: 'Phone number is not valid'
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function(v: Date) {
                // No future dates allowed
                return v <= new Date();
            },
            message: 'Date of birth cannot be in the future'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    role: {
        type: String,
        enum: roles,
        default: 'patient',
        required: true
    },
    status: {
        type: String,
        enum: statuses,
        default: 'active',
        required: true
    }
}, {
    _id: false, // Disable automatic _id generation since we're using custom string IDs
    timestamps: true,
    versionKey: false
});

// Indexes for better query performance
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ phone: 1 }); // Add phone index
userSchema.index({ dateOfBirth: 1 }); // Add DOB index for age-based queries

// Compound indexes for common query patterns (optional optimizations)
userSchema.index({ status: 1, role: 1 }); // For filtering by both status and role
userSchema.index({ role: 1, createdAt: -1 }); // For role-based queries with sorting

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export default mongoose.model<IUser>('User', userSchema);