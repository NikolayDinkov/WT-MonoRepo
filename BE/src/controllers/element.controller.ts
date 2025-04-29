import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { getAllElementsForOwner, uploadFileForOwner } from '../services/element.service';

const getElements = (req: Request, res: Response) => {
  const ownerId = new Types.ObjectId(req.params.ownerId);
  try {
    getAllElementsForOwner(ownerId).then((elements) =>
      res.status(200).json(elements)
    );
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const uploadFile = (req: Request, res: Response): void => {
  const ownerId = new Types.ObjectId(req.params.ownerId);
  try {
    const { file } = req;
    if (!file) {
      res.status(400).json({ error: 'Could not read file' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) /*10MB limit*/ {
      res.status(400).json({ error: 'File size exceeds limit' });
      return;
    }

    const { originalname, mimetype, size, buffer } = file;

    uploadFileForOwner(ownerId, file);

    res.status(201).json({
      message: `File "${originalname}" uploaded successfully`,
      file: {
        name: originalname,
        type: mimetype,
        size,
      },
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { getElements, uploadFile };