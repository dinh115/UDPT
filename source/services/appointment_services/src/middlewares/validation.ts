import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../types';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const response: ApiResponse = {
            success: false,
            message: 'Validation failed',
            error: errors.array().map(err => err.msg).join(', ')
        };
        res.status(400).json(response);
        return;
    }
    next();
};

export const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('phone')
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('role')
        .optional()
        .isIn(['patient', 'doctor', 'admin'])
        .withMessage('Role must be patient, doctor, or admin'),
    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

export const validateAppointment = [
    body('doctorId')
        .isMongoId()
        .withMessage('Please provide a valid doctor ID'),
    body('appointmentDate')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid appointment date'),
    body('timeSlot.startTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),
    body('timeSlot.endTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format'),
    body('symptoms')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Symptoms cannot exceed 500 characters'),
    handleValidationErrors
];

export const validateDoctorProfile = [
    body('specialization')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Specialization must be between 2 and 100 characters'),
    body('experience')
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be between 0 and 50 years'),
    body('qualifications')
        .isArray({ min: 1 })
        .withMessage('At least one qualification is required'),
    body('consultationFee')
        .isFloat({ min: 0 })
        .withMessage('Consultation fee must be a positive number'),
    body('availability')
        .isArray()
        .withMessage('Availability must be an array'),
    handleValidationErrors
];