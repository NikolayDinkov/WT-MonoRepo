import { Types } from 'mongoose';
import Element, { IElement } from '../models/element.model';

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

export const createElement = (elementData: {
  name: string;
  path: string;
  owner: Types.ObjectId;
  parent: Types.ObjectId | null;
  sharedWith: Types.ObjectId[];
  gridFsId: Types.ObjectId | null;
  type: 'File' | 'Directory';
}) => new Element(elementData).save();


