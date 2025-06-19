import { Router } from 'express';
import { DoctorController } from '../controllers/doctorController';
import { auth, authorize } from '../middlewares/auth';
import { validateDoctorProfile, validateDoctorIdWithDate, validateDoctorId, validateDoctorIdWithDateQuery } from '../middlewares/validation';
import { UserRole } from '../types/user.types';

const router = Router();

// Create doctor profile
router.post('/profile',
    auth,
    authorize(UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN),
    validateDoctorProfile,
    DoctorController.createDoctorProfile
);

// Get all doctors (public)
router.get('/', DoctorController.getAllDoctors);

// Get doctor by ID (public)
router.get('/:doctorId', validateDoctorId, DoctorController.getDoctorById);

// Update doctor profile
router.put('/profile',
    auth,
    authorize(UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN),
    DoctorController.updateDoctorProfile
);


// Generate time slots utility (for testing/admin purposes)
router.post('/generate-slots',
    //auth,
    DoctorController.generateTimeSlots
);

// Update doctor availability with auto-generated slots
router.put('/:doctorId/availability',
    auth,
    authorize(UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN),
    validateDoctorId,
    DoctorController.updateDoctorAvailability
);

// Get doctor slot statistics
router.get('/:doctorId/slot-statistics',
    auth,
    authorize(UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN),
    validateDoctorIdWithDateQuery,
    DoctorController.getDoctorSlotStatistics
);

// Regenerate all slots for a doctor
router.post('/:doctorId/regenerate-slots',
    auth,
    authorize(UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN),
    validateDoctorId,
    DoctorController.regenerateDoctorSlots
);

// Get available time slots for a specific doctor and date
router.get('/:doctorId/:date',
    validateDoctorIdWithDate,
    DoctorController.getAvailableTimeSlots);

export default router;