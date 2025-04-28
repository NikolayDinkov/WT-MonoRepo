import { Router } from 'express';
import elementController from '../controllers/element.controller';

const router = Router();

router.get('/:ownerId', elementController.getElements);

export default router;
