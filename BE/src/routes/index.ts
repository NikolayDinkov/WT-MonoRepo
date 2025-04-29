import { Router, Request, Response } from 'express';
import elements from './elements';
const router = Router();

router.use('/elements', elements);

export default router;
