import { Router } from 'express';
import { upload } from "../utils/upload";

import elementController from '../controllers/element.controller';

const router = Router();

router.get('/:ownerId', elementController.getElements);
router.post('/upload/file', upload().single('file'), async (req, res) => {
    try {
      res.status(201).json({ text: "File uploaded successfully !" });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: { text: "Unable to upload the file", error },
      });
    }
  });
  
export default router;
