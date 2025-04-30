import { Types } from 'mongoose';
import Element, { IElement } from '../models/element.model';
import { getGridFSBucket } from '../config/database';
import { Response } from 'express';
import mongoose from 'mongoose';

export const getSharedElementsForUser = (userId: Types.ObjectId) => {
  return Element.find({ sharedWith: userId }).lean().exec();
};

export const getAllElementsForOwner = (userId: Types.ObjectId) => {
  return Element.find({ owner: userId }).lean().exec();
};

export const getElementsByName = (name: string) => {
  return Element.find({ name }).lean().exec();
};

export const getFilesByName = (name: string) => {
  return Element.find({ name, type: 'File' }).lean().exec();
};

export const getDirectoriesByName = (name: string) => {
  return Element.find({ name, type: 'Directory' }).lean().exec();
};

export const uploadFileForOwner = (ownerId: Types.ObjectId, file: Express.Multer.File) => {
  const { originalname, mimetype, size, buffer } = file;
};

export const uploadFilesForOwner = (ownerId: Types.ObjectId, files: Express.Multer.File[]) => {
  files.forEach((file) => {
    const { originalname, mimetype, size, buffer } = file;
    
    // Logic to handle file upload
  });
}

export const downloadFileById = async (fileId: string, res: Response): Promise<void> => {
  const bucket = getGridFSBucket();

    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    if (files.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const file = files[0];
    
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename=${file.filename}`);

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.pipe(res);
};

export const createElement = (elementData: {
  name: string;
  path: string;
  owner: Types.ObjectId;
  parent: Types.ObjectId | null;
  sharedWith: Types.ObjectId[];
  gridFsId: Types.ObjectId | null;
  type: 'File' | 'Directory';
}) => new Element(elementData).save();


