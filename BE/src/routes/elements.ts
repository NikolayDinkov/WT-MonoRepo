import { Router } from 'express';
import { upload } from "../utils/upload";

import elementController from '../controllers/element.controller';

const router = Router();

router.get('/:ownerId', elementController.getElements);
router.post('/upload/file/:ownerId', upload().single('file'), elementController.uploadFile);
router.post('/upload/files/:ownerId', upload().array('files'), elementController.uploadFiles);
router.post('/download/files/:fileId', elementController.downloadFile);

export default router;
