import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { auth } from '../middlewares/auth';
import { validateAppointment } from '../middlewares/validation';

const router = Router();

router.post('/', auth, validateAppointment, AppointmentController.bookAppointment);
router.get('/my-appointments', auth, AppointmentController.getMyAppointments);
router.patch('/:appointmentId/cancel', auth, AppointmentController.cancelAppointment);

export default router;
