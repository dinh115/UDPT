import { Router } from 'express';
import { DoctorController } from '../controllers/doctorController';
import { auth, authorize } from '../middlewares/auth';
import { validateDoctorProfile } from '../middlewares/validation';
import { UserRole } from '../types/user.types';
const router = Router();

router.post('/profile',
    auth,
    authorize(UserRole.DOCTOR),
    validateDoctorProfile,
    DoctorController.createDoctorProfile
);
router.get('/', DoctorController.getAllDoctors);
router.get('/:doctorId', DoctorController.getDoctorById);
router.put('/profile',
    auth,
    authorize(UserRole.DOCTOR),
    DoctorController.updateDoctorProfile
);

export default router;