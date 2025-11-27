import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerValidator), authController.register.bind(authController));
router.post('/login', validate(loginValidator), authController.login.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));

export default router;

