import { Router } from 'express';
import { login, signup } from '../controllers/user.controller';
import {
  loginValidation,
  signupValidation,
} from '../middleware/authValidation';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

export default router;
