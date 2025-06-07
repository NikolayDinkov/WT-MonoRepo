import { Router, Request, Response } from 'express';
import elements from './elements';
import users from './auth';
import { checkAuth } from '../middleware/auth';
const router = Router();

router.use('/users', users);
router.use('/elements', checkAuth, elements);

export default router;
