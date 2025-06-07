import { getGridFSBucket } from '../config/database';
import mongoose, { Types } from 'mongoose';
// import element.service.ts so i can use the methods inside
import { deleteElementByGridFsId } from './element.service';

export const uploadFileForOwner = (userId: Types.ObjectId, file: Express.Multer.File) => {
  const { originalname, mimetype, size, buffer } = file;


  // Your upload logic here
};

export const getFileMetadataById = async (fileId: string): Promise<any> => {
  const bucket = getGridFSBucket();
  const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
  if (files.length === 0) throw new Error('File not found');
  return files[0];
}

export const uploadFilesForOwner = (userId: Types.ObjectId, files: Express.Multer.File[]) => {
  files.forEach(file => {
    const { originalname, mimetype, size, buffer } = file;
    // Your upload logic here
  });
};

export const downloadFileById = async (fileId: string): Promise<{ stream: any; file: any }> => {
  const bucket = getGridFSBucket();
  const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

  if (files.length === 0) throw new Error('File not found');

  const file = files[0];
  const stream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

  return { stream, file };
};

export const downloadMultipleFiles = async (): Promise<{ archive: any }> => {
  const bucket = getGridFSBucket();
  const files = await bucket.find().toArray();
  if (files.length === 0) throw new Error('No files found');

  const archiver = require('archiver');
  const archive = archiver('zip', { zlib: { level: 9 } });

  files.forEach(file => {
    const stream = bucket.openDownloadStream(new mongoose.Types.ObjectId(file._id));
    archive.append(stream, { name: file.filename });
  });

  archive.finalize();

  return { archive };
};

export const renameFileById = async (fileId: string, newName: string) => {
  const bucket = getGridFSBucket();
  const files = await bucket.find({ _id: new Types.ObjectId(fileId) }).toArray();
  if (files.length === 0) throw new Error('File not found');

  await bucket.rename(new Types.ObjectId(fileId), newName);

  return { message: 'File renamed successfully', filename: newName };
};

export const deleteFileById = async (fileId: string) => {
  const bucket = getGridFSBucket();
  const files = await bucket.find({ _id: new Types.ObjectId(fileId) }).toArray();
  if (files.length === 0) throw new Error('File not found');

  await bucket.delete(new Types.ObjectId(fileId));
  deleteElementByGridFsId(new Types.ObjectId(fileId));

  return { message: 'File deleted successfully' };
};
