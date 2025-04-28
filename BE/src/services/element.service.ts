import { Types } from 'mongoose';
import Element from '../models/element.model';

export const getRootElementsForUser = (userId: Types.ObjectId) => {
  return Element.find({
    parent: null,
    owner: userId,
  });
};

export const getSharedElementsForUser = (userId: Types.ObjectId) => {
  return Element.find({
    sharedWith: userId,
  });
};

export const getElementsByName = (name: String) => {
  return Element.find({
    name: name,
  });
};

export const getFilesByName = (name: String) => {
  return Element.find({
    name: name,
    type: 'File',
  });
};

export const getDirectoriesByName = (name: String) => {
  return Element.find({
    name: name,
    type: 'Directory',
  });
};

export const createElement = async (
  name: string,
  path: string,
  owner: Types.ObjectId,
  parent: Types.ObjectId | null,
  sharedWith: Types.ObjectId[],
  gridFsId: Types.ObjectId | null
): Promise<any> => {
  const element = new Element({
    name,
    path,
    owner,
    parent,
    sharedWith,
    gridFsId,
  });

  await element.save();

  return element;
};
