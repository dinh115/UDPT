import Joi from 'joi';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

// =================== VALIDATION SCHEMAS ===================

export const validateUserIdSchema = Joi.object({
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
}
)

export const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.username': 'Please provide a valid username address',
        'any.required': 'Username is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    })
});

export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    username: Joi.string()
        .trim()
        .pattern(/^(?=.{3,20}$)(?!.*[_.-]{2})[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/)
        .required()
        .messages({
            'string.pattern.base':
                'Username cannot start or end with special characters, and cannot have consecutive special characters.',
            'string.empty': 'Username is required.',
            'any.required': 'Username is required.'
        }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    firstName: Joi.string().trim().min(1).max(50).required().messages({
        'string.min': 'First name cannot be empty',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().trim().min(1).max(50).required().messages({
        'string.min': 'Last name cannot be empty',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
    }),
    phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'any.required': 'Phone number is required'
        }),
    address: Joi.string().trim().min(1).max(200).required().messages({
        'string.min': 'Address cannot be empty',
        'string.max': 'Address cannot exceed 200 characters',
        'any.required': 'Address is required'
    }),
    dateOfBirth: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .custom((value, helpers) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return helpers.error('any.invalid', { value });
            }
            const now = new Date();
            if (date > now) {
                return helpers.error('date.max', { value });
            }
            return value;
        }, 'Date Validation')
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'any.required': 'Date is required',
            'any.invalid': 'Date is invalid',
            'date.max': 'Date cannot be in the future'
        })
});


export const createUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    username: Joi.string()
        .trim()
        .pattern(/^(?=.{3,20}$)(?!.*[_.-]{2})[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/)
        .required()
        .messages({
            'string.pattern.base':
                'Username cannot start or end with special characters, and cannot have consecutive special characters.',
            'string.empty': 'Username is required.',
            'any.required': 'Username is required.'
        }),
    firstName: Joi.string().trim().min(1).max(50).required().messages({
        'string.min': 'First name cannot be empty',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().trim().min(1).max(50).required().messages({
        'string.min': 'Last name cannot be empty',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password must be at least 6 characters long'
    }),
    role: Joi.string().valid('patient', 'admin', 'doctor', 'employee').optional().default('patient').messages({
        'any.only': 'Role must be either patient, admin, doctor or employee'
    }),
    status: Joi.string().valid('active', 'inactive').optional().default('active').messages({
        'any.only': 'Status must be either active or inactive'
    }),
    phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),
    address: Joi.string().trim().min(1).max(200).optional().messages({
        'string.min': 'Address cannot be empty',
        'string.max': 'Address cannot exceed 200 characters'
    }),
    dateOfBirth: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .custom((value, helpers) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return helpers.error('any.invalid', { value });
            }
            const now = new Date();
            if (date > now) {
                return helpers.error('date.max', { value });
            }
            return value;
        }, 'Date Validation')
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'any.required': 'Date is required',
            'any.invalid': 'Date is invalid',
            'date.max': 'Date cannot be in the future'
        })
});

export const updateUserSchema = Joi.object({
    firstName: Joi.string().trim().min(1).max(50).optional().messages({
        'string.min': 'First name cannot be empty',
        'string.max': 'First name cannot exceed 50 characters'
    }),
    lastName: Joi.string().trim().min(1).max(50).optional().messages({
        'string.min': 'Last name cannot be empty',
        'string.max': 'Last name cannot exceed 50 characters'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password must be at least 6 characters long'
    }),
    role: Joi.string().valid('patient', 'admin', 'doctor', 'employee').optional().messages({
        'any.only': 'Role must be either patient, admin, doctor or employee'
    }),
    status: Joi.string().valid('active', 'inactive').optional().messages({
        'any.only': 'Status must be either active or inactive'
    }),
    phone: Joi.string()
        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),
    address: Joi.string().trim().min(1).max(200).optional().messages({
        'string.min': 'Address cannot be empty',
        'string.max': 'Address cannot exceed 200 characters'
    }),
    dateOfBirth: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
        .custom((value, helpers) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return helpers.error('any.invalid', { value });
            }
            const now = new Date();
            if (date > now) {
                return helpers.error('date.max', { value });
            }
            return value;
        }, 'Date Validation')
        .messages({
            'string.pattern.base': 'Date must be in YYYY-MM-DD format',
            'any.invalid': 'Date is invalid',
            'date.max': 'Date cannot be in the future'
        })

});

export const tokenVerifySchema = Joi.object({
    token: Joi.string().required().messages({
        'any.required': 'Token is required'
    })
});

/**
 * Query parameter schema for user listing
 */
export const userQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    }),
    status: Joi.string().valid('active', 'inactive').optional().messages({
        'any.only': 'Status must be either active or inactive'
    }),
    role: Joi.string().valid('patient', 'admin', 'employee', 'doctor').optional().messages({
        'any.only': 'Role must be either patient, admin, employee or doctor'
    }),
    search: Joi.string().trim().max(100).optional().messages({
        'string.max': 'Search term cannot exceed 100 characters'
    }),
    sortBy: Joi.string().valid('createdAt', 'email', 'username', 'firstName', 'lastName').default('createdAt').messages({
        'any.only': 'Sort by must be one of: createdAt, email, username, firstName, lastName'
    }),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
        'any.only': 'Sort order must be either asc or desc'
    })
});

export const batchUsersSchema = Joi.object({
    userIds: Joi.array()
        .items(Joi.string().custom((value, helpers) => {
            if (!isValidUUIDv4(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }).messages({
            'any.invalid': 'Each user ID must be a valid UUID v4'
        }))
        .min(1)
        .max(100)
        .required()
        .messages({
            'array.min': 'At least one user ID is required',
            'array.max': 'Cannot process more than 100 user IDs at once',
            'any.required': 'User IDs array is required'
        })
});

/**
 * Check if a string is a valid UUID v4
 */
export const isValidUUIDv4 = (uuid: string): boolean => {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};
