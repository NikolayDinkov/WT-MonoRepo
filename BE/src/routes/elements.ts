import { Router } from 'express';
import elementController from '../controllers/element.controller';
import { checkAuth } from '../middleware/auth';

const router = Router();

router.get('/:ownerId', checkAuth, elementController.getElements);

export default router;
