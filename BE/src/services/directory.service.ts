import { Types } from 'mongoose';
import Directory from '../models/directory.model';

export const getRootDirectoriesForUser = (userId: Types.ObjectId) => {
  return Directory.find({
    parent: null,
    owner: userId,
  });
};

export const getSharedDirectoriesForUser = (userId: Types.ObjectId) => {
  return Directory.find({
    permissions: userId,
  });
};
