import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { auth } from '../middlewares/auth';
import { validateRegistration, validateLogin } from '../middlewares/validation';

const router = Router();

router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/profile', auth, AuthController.getProfile);

export default router;