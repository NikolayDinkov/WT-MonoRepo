import { Types } from 'mongoose';
import File from '../models/file.model';

export const getRootFilesForUser = (userId: Types.ObjectId) => {
  return File.find({
    parent: null,
    owner: userId,
  });
};

export const createFile = async (
  name: string,
  path: string,
  owner: Types.ObjectId,
  parent: Types.ObjectId | null,
  gridFsId: Types.ObjectId
): Promise<any> => {
  const file = new File({
    name,
    path,
    owner,
    parent,
    gridFsId,
  });

  await file.save();

  return file;
};
