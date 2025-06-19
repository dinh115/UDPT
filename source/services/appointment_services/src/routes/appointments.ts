import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { auth, authorize } from '../middlewares/auth';
import { validateAppointment, validateAppointmentUpdate, validateAppointmentId } from '../middlewares/validation';
import { UserRole } from '../types/user.types';

const router = Router();

// Book new appointment (patients only)
router.post('/',
    auth,
    validateAppointment,
    AppointmentController.bookAppointment
);

// Get user's appointments (both patients and doctors can access their own)
router.get('/my-appointments',
    auth,
    AppointmentController.getMyAppointments
);

// Update appointment (both patient and doctor can update pending appointments)
router.patch('/:appointmentId/update',
    auth,
    validateAppointmentId,
    validateAppointmentUpdate,
    AppointmentController.updateAppointment
);

// Accept appointment
router.patch('/:appointmentId/accept',
    auth,
    authorize(UserRole.DOCTOR, UserRole.EMPLOYEE, UserRole.ADMIN),
    validateAppointmentId,
    AppointmentController.acceptAppointment
);

// Cancel appointment
router.patch('/:appointmentId/cancel',
    auth,
    validateAppointmentId,
    AppointmentController.cancelAppointment
);

export default router;