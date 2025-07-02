import Joi from 'joi';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

const validateDateNotInPast = (value: string | Date, helpers: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset to start of day

    const inputDate = new Date(value);

    if (isNaN(inputDate.getTime())) {
        return helpers.error('any.invalid'); // cannot parse date
    }

    if (inputDate < today) {
        return helpers.error('date.less');
    }

    return value;
};

export const tokenVerifySchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token is required'
    })
});

export const timeSlotSchema = Joi.object({
    id: Joi.string().optional(),
    startTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
            'any.required': 'Start time is required',
            'string.pattern.base': 'Start time must be in HH:MM format'
        }),
    endTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
            'any.required': 'End time is required',
            'string.pattern.base': 'End time must be in HH:MM format'
        }),
    isBooked: Joi.boolean().optional()
});

export const availabilitySchema = Joi.object({
    day: Joi.string()
        .valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
        .required()
        .messages({
            'any.only': 'Day must be a valid day of the week',
            'any.required': 'Day is required'
        }),
    slots: Joi.array().items(timeSlotSchema).min(1).required().messages({
        'array.min': 'At least one time slot is required for each day',
        'any.required': 'Slots are required'
    })
});

export const validateAppointmentIdSchema = Joi.object({
    AppointmentId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Appointment ID is required',
            'any.invalid': 'Appointment ID must be a valid UUID v4'
        }),
});

// BookAppointmentRequest schema
export const bookAppointmentSchema = Joi.object({
    doctorId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Doctor ID is required',
            'any.invalid': 'Doctor ID must be a valid UUID v4'
        }),
    appointmentDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .custom(validateDateNotInPast)
        .required()
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'any.required': 'Date is required',
            'date.less': 'Date must not be in the past',
            'any.invalid': 'Date is invalid'
        }),
    timeSlot: timeSlotSchema.required().messages({
        'any.required': 'Time slot is required'
    }),
    notes: Joi.string().max(500).optional().messages({
        'string.max': 'Notes cannot be more than 500 characters'
    }),
    patientId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .optional()
        .messages({
            'any.invalid': 'Patient ID must be a valid UUID v4'
        }),
});

// UpdateAppointmentRequest schema
export const updateAppointmentSchema = Joi.object({
    appointmentId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Appointment ID is required',
            'any.invalid': 'Appointment ID must be a valid UUID v4'
        }),
    appointmentDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .custom(validateDateNotInPast)
        .optional()
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'date.less': 'Date must not be in the past',
            'any.invalid': 'Date is invalid'
        }),
    timeSlot: timeSlotSchema.optional(),
    notes: Joi.string().max(500).optional().messages({
        'string.max': 'Notes cannot be more than 500 characters'
    })
});

// AcceptAppointmentRequest schema
export const acceptAppointmentSchema = Joi.object({
    appointmentId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Appointment ID is required',
            'any.invalid': 'Appointment ID must be a valid UUID v4'
        })
});

// CancelAppointmentRequest schema
export const cancelAppointmentSchema = Joi.object({
    appointmentId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Appointment ID is required',
            'any.invalid': 'Appointment ID must be a valid UUID v4'
        })
});

// GetMyAppointmentsRequest schema
export const getMyAppointmentsSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'confirmed', 'completed', 'cancelled')
        .optional()
        .messages({
            'any.only': 'Status must be one of: pending, confirmed, completed, cancelled'
        }),
    page: Joi.number().integer().min(1).default(1).optional().empty('').messages({
        'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).optional().empty('').messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    })
});

// User schema for validation
export const userSchema = Joi.object({
    id: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'User ID is required',
            'any.invalid': 'User ID must be a valid UUID v4'
        }),
    name: Joi.string().min(1).max(100).required().messages({
        'any.required': 'Name is required',
        'string.min': 'Name cannot be empty',
        'string.max': 'Name cannot be more than 100 characters'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    phone: Joi.string()
        .pattern(/^[+]?[\d\s\-\(\)]{10,15}$/)
        .required()
        .messages({
            'any.required': 'Phone is required',
            'string.pattern.base': 'Phone must be a valid phone number'
        })
});

// Doctor schema for validation
export const doctorSchema = Joi.object({
    id: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Doctor ID is required',
            'any.invalid': 'Doctor ID must be a valid UUID v4'
        }),
    user: userSchema.required().messages({
        'any.required': 'User information is required'
    })
});

// AuthContext schema for validation
export const authContextSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'User ID is required',
            'any.invalid': 'User ID must be a valid UUID v4'
        }),
    role: Joi.string()
        .valid('PATIENT', 'DOCTOR', 'EMPLOYEE', 'ADMIN')
        .required()
        .messages({
            'any.required': 'Role is required',
            'any.only': 'Role must be one of: PATIENT, DOCTOR, EMPLOYEE, ADMIN'
        }),
    token: Joi.string().required().messages({
        'any.required': 'Token is required'
    })
});

export const appointmentQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    }),
    status: Joi.string()
        .valid('pending', 'confirmed', 'completed', 'cancelled')
        .optional()
        .messages({
            'any.only': 'Status must be one of: pending, confirmed, completed, cancelled'
        }),
    sortBy: Joi.string()
        .valid('createdAt', 'appointmentDate', 'status')
        .default('createdAt')
        .messages({
            'any.only': 'Sort by must be one of: createdAt, appointmentDate, status'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .default('desc')
        .messages({
            'any.only': 'Sort order must be either asc or desc'
        })
});

export const batchAppointmentSchema = Joi.object({
    appointmentIds: Joi.array()
        .items(Joi.string().custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }).messages({
            'any.invalid': 'Each appointment ID must be a valid UUID v4'
        }))
        .min(1)
        .max(100)
        .required()
        .messages({
            'array.min': 'At least one appointment ID is required',
            'array.max': 'Cannot process more than 100 appointment IDs at once',
            'any.required': 'Appointment IDs array is required'
        })
});



/**
 * Check if a string is a valid UUID v4
 */
export const isValidUUIDv4 = (uuid: string): boolean => {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};