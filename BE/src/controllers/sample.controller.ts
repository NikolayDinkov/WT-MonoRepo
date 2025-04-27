import { getRootFilesForUser } from '../services/file.service';
import {
  getRootDirectoriesForUser,
  getSharedDirectoriesForUser,
} from '../services/directory.service';

export const getMyRootFilesAndDirectories = async (req, res) => {
  const userId = req.user._id; // retrive the user when its logic is implemented

  const [files, directories] = await Promise.all([
    getRootFilesForUser(userId),
    getRootDirectoriesForUser(userId),
  ]);

  res.json({ files, directories });
};

export const getSharedDirectories = async (req, res) => {
  const userId = req.user._id; // retrive the user when its logic is implemented

  const sharedDirectories = await getSharedDirectoriesForUser(userId);

  res.json({ sharedDirectories });
};
