import Joi from 'joi';
import { validate as uuidValidate } from 'uuid';

export const tokenVerifySchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token is required'
    })
});

export const timeSlotSchema = Joi.object({
    startTime: Joi.string().required().messages({
        'any.required': 'Start time is required'
    }),
    endTime: Joi.string().required().messages({
        'any.required': 'End time is required'
    }),
    isBooked: Joi.boolean().optional()
});

export const availabilitySchema = Joi.object({
    day: Joi.string()
        .valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')
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

export const validateUserIdSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'User ID is required',
            'any.invalid': 'User ID must be a valid UUID'
        }),
}
)

export const validateDoctorIdSchema = Joi.object({
    doctorId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Doctor ID is required',
            'any.invalid': 'Doctor ID must be a valid UUID'
        }),
}
)

export const createDoctorProfileSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'User ID is required',
            'any.invalid': 'User ID must be a valid UUID'
        }),

    specialization: Joi.string().required().messages({
        'any.required': 'Specialization is required'
    }),

    experience: Joi.number().integer().min(0).required().messages({
        'number.base': 'Experience must be a number',
        'any.required': 'Experience is required'
    }),

    qualifications: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.min': 'At least one qualification is required',
        'any.required': 'Qualifications are required'
    }),

    availability: Joi.array().items(availabilitySchema).min(1).required().messages({
        'array.min': 'At least one availability is required',
        'any.required': 'Availability is required'
    })
});

export const updateDoctorAvailabilitySchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'User ID is required',
            'any.invalid': 'User ID must be a valid UUID'
        }),

    availability: Joi.array().items(availabilitySchema).min(1).optional()
});

export const updateDoctorProfileSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'User ID is required',
            'any.invalid': 'User ID must be a valid UUID'
        }),

    specialization: Joi.string().optional(),

    experience: Joi.number().integer().min(0).optional(),

    qualifications: Joi.array().items(Joi.string()).optional(),

    availability: Joi.array().items(availabilitySchema).optional() // ← đã bỏ min(1)
});


export const doctorQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.min': 'Page must be at least 1'
    }),

    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    }),

    specialization: Joi.string().trim().max(100).optional().messages({
        'string.max': 'Specialization cannot exceed 100 characters'
    }),

    sortBy: Joi.string()
        .valid('createdAt', 'experience', 'specialization')
        .empty('')
        .default('createdAt')
        .messages({
            'any.only': 'Sort by must be one of: createdAt, experience, specialization'
        }),

    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .empty('')
        .default('desc')
        .messages({
            'any.only': 'Sort order must be either asc or desc'
        })
});


export const batchDoctorProfileSchema = Joi.object({
    doctorIds: Joi.array()
        .items(Joi.string().custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }).messages({
            'any.invalid': 'Each doctor ID must be a valid UUID'
        }))
        .min(1)
        .max(100)
        .required()
        .messages({
            'array.min': 'At least one doctor ID is required',
            'array.max': 'Cannot process more than 100 doctor IDs at once',
            'any.required': 'Doctor IDs array is required'
        })
});

const validateDateNotInPast = (value: string, helpers: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset về đầu ngày

    const inputDate = new Date(value);

    if (isNaN(inputDate.getTime())) {
        return helpers.error('any.invalid'); // không parse được date
    }

    if (inputDate < today) {
        return helpers.error('date.less');
    }

    return value;
};

export const getAvailableTimeSlotsSchema = Joi.object({
    doctorId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Doctor ID is required',
            'any.invalid': 'Doctor ID must be a valid UUID'
        }),

    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .custom(validateDateNotInPast)
        .required()
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'any.required': 'Date is required',
            'date.less': 'Date must not be in the past',
            'any.invalid': 'Date is invalid'
        })
});

export const getDoctorTimeSlotsStatisticsSchema = Joi.object({
    doctorId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Doctor ID is required',
            'any.invalid': 'Doctor ID must be a valid UUID'
        }),

    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .custom(validateDateNotInPast)
        .optional()
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'date.less': 'Date must not be in the past',
            'any.invalid': 'Date is invalid'
        })
});

/**
 * Joi schema to validate GenerateTimeSlotsRequest
 */
export const generateTimeSlotsSchema = Joi.object({
    startTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.pattern.base': 'startTime must be in HH:mm format',
            'any.required': 'startTime is required'
        }),

    endTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.pattern.base': 'endTime must be in HH:mm format',
            'any.required': 'endTime is required'
        }),

    gap: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'gap must be a number',
            'number.min': 'gap must be at least 1 minute',
            'any.required': 'gap is required'
        })
}).custom((value, helpers) => {
    const { startTime, endTime } = value;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes <= startTotalMinutes) {
        return helpers.error('any.invalid', { message: 'endTime must be greater than startTime' });
    }

    return value;
});

export const updateBookingSchema = Joi.object({
    doctorId: Joi.string()
        .custom((value, helpers) => {
            if (!isValidUUID(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.required': 'Doctor ID is required',
            'any.invalid': 'Doctor ID must be a valid UUID'
        }),

    appointmentDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            'string.pattern.base': 'Appointment date must be in YYYY-MM-DD format',
            'any.required': 'Appointment date is required'
        }),

    timeSlot: timeSlotSchema,

    isBooked: Joi.boolean().required().messages({
        'any.required': 'isBooked flag is required'
    })
});

/**
 * Check if a string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
    return uuidValidate(uuid);
};
