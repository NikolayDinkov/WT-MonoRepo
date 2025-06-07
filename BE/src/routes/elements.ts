import { Router } from 'express';
import { upload } from '../utils/upload';

import elementController from '../controllers/element.controller';

const router = Router();

router.get('/', elementController.getAllElements);
router.get('/shared', elementController.getAllSharedWithUser);

router.post(
  '/upload/file/:ownerId',
  upload().single('file'),
  elementController.uploadFile
);
router.post(
  '/upload/files/:ownerId',
  upload().array('files'),
  elementController.uploadFiles
);

router.post('/download/files/:fileId', elementController.downloadFile);
router.post('/download/files', elementController.downloadFiles);
router.post('/delete/files/:fileId', elementController.deleteFile);

export default router;
