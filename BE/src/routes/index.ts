import { Router, Request, Response } from 'express';
import elements from './elements';
import users from './auth';
import { checkAuth } from '../middleware/auth';
const router = Router();

router.use('/users', users);
router.use(checkAuth); //every route after this one is protected
router.use('/elements', elements);

export default router;
