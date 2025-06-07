import Element from '../models/element.model';
import { Types } from 'mongoose';

import { getFileMetadataById } from './file.service';


export const getAllElementsForOwner = (userId: Types.ObjectId) => {
  return Element.find({ owner: userId }).lean().exec();
};

export const getAllSharedElementsForUser = (userId: Types.ObjectId) => {
  return Element.find({ sharedWith: { $in: [userId] } }).lean().exec();
}

export const getMetadataById = async (userId: Types.ObjectId, elementId: Types.ObjectId) => {
  const element = await Element.findOne({ _id: elementId, owner: userId }).lean().exec();
  if (!element) {
    throw new Error('Element not found or you do not have access to it');
  }

  if (element.type === 'file' && element.gridFsId) {
    return getFileMetadataById(element.gridFsId.toString());
  }

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

export const deleteElementByGridFsId = (gridFsId: Types.ObjectId) => {
  return Element.deleteOne({ gridFsId }).exec();
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
