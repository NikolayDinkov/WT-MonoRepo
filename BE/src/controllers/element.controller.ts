import { Request, Response } from 'express';
import { getAllElementsForOwner } from '../services/element.service';
import { Types } from 'mongoose';

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

export default { getElements };
