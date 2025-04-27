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

export const createDirectory = async (
  name: string,
  path: string,
  owner: Types.ObjectId,
  parent: Types.ObjectId | null,
  permissions: Types.ObjectId[]
): Promise<any> => {
  const directory = new Directory({
    name,
    path,
    owner,
    parent,
    permissions,
  });

  await directory.save();

  return directory;
};
