import { Types } from 'mongoose';
import File from '../models/file.model';

export const getRootFilesForUser = (userId: Types.ObjectId) => {
  return File.find({
    parent: null,
    owner: userId,
  });
};
