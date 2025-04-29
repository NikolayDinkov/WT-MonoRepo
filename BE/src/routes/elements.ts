import { Router } from 'express';
import multer from 'multer';
import elementController from '../controllers/element.controller';

const upload = multer();
const router = Router();

router.get('/:ownerId', elementController.getElements);
router.post('/upload/file/:ownerId', upload.single('file'), elementController.uploadFile);

export default router;
