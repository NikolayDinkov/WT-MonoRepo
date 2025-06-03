import { Router, Request, Response } from 'express';
import elements from './elements';
import users from './auth';
const router = Router();

router.use('/elements', elements);
router.use('/users', users);

export default router;
