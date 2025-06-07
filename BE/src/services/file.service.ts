import { getGridFSBucket } from '../config/database';
import mongoose, { Types } from 'mongoose';

// import element.service.ts so i can use the methods inside
import { deleteElementByGridFsId } from './element.service';

export const getFileMetadataById = async (
  fileId: Types.ObjectId
): Promise<any> => {
  const bucket = getGridFSBucket();
  const files = await bucket.find({ _id: fileId }).toArray();
  if (files.length === 0) throw new Error('File not found');
  return files[0];
};

export const getFilesByIds = async (
  fileIds: Types.ObjectId[]
): Promise<any[]> => {
  const bucket = getGridFSBucket();
  return await bucket.find({ _id: { $in: fileIds } }).toArray();
};

export const downloadFileById = async (
  elementId: string
): Promise<{ stream: any; file: any }> => {
  const element = await Element.findById(elementId).lean().exec();

  const bucket = getGridFSBucket();
  const files = await bucket
    .find({ _id: new mongoose.Types.ObjectId(fileId) })
    .toArray();

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

  files.forEach((file) => {
    const stream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(file._id)
    );
    archive.append(stream, { name: file.filename });
  });

  archive.finalize();

  return { archive };
};

export const renameFileById = async (fileId: string, newName: string) => {
  const bucket = getGridFSBucket();
  const files = await bucket
    .find({ _id: new Types.ObjectId(fileId) })
    .toArray();
  if (files.length === 0) throw new Error('File not found');

  await bucket.rename(new Types.ObjectId(fileId), newName);

  return { message: 'File renamed successfully', filename: newName };
};
