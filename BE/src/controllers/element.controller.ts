import { Request, Response } from 'express';
import { Types } from 'mongoose';

import * as ElementService from '../services/element.service';
import * as FileService from '../services/file.service';

const getElements = async (req: Request, res: Response) => {
  try {
    const ownerId = new Types.ObjectId(req.params.ownerId);
    const elements = await ElementService.getAllElementsForOwner(ownerId);
    res.status(200).json(elements);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch elements' });
  }
};

const uploadFile = async (req: Request, res: Response) => {
  try {
    const ownerId = new Types.ObjectId(req.params.ownerId);
    if (req.file) {
      await FileService.uploadFileForOwner(ownerId, req.file);
      res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ error: 'No file provided' });
    }
  } catch (error) {
    res.status(400).json({ error: 'File upload failed' });
  }
};

const uploadFiles = async (req: Request, res: Response) => {
  try {
    const ownerId = new Types.ObjectId(req.params.ownerId);
    if (req.files && Array.isArray(req.files)) {
      await FileService.uploadFilesForOwner(ownerId, req.files as Express.Multer.File[]);
      res.status(200).json({ message: 'Files uploaded successfully' });
    } else {
      res.status(400).json({ error: 'No files provided' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Files upload failed' });
  }
};

const downloadFile = async (req: Request, res: Response) => {
  try {
    const { stream, file } = await FileService.downloadFileById(req.params.fileId);
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename=${file.filename}`);
    stream.pipe(res);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
};

const downloadFiles = async (_req: Request, res: Response) => {
  try {
    const { archive } = await FileService.downloadMultipleFiles();
    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=files.zip");
    res.set("Access-Control-Allow-Origin", "*");
    archive.pipe(res);
  } catch (error) {
    res.status(404).json({ error: 'No files to download' });
  }
};

const renameFile = async (req: Request, res: Response) => {
  try {
    const { fileId, newName } = req.body;
    const result = await FileService.renameFileById(fileId, newName);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: 'Rename failed' });
  }
};

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.body;
    const result = await FileService.deleteFileById(fileId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: 'Delete failed' });
  }
};

export default {
  getElements,
  uploadFile,
  uploadFiles,
  downloadFile,
  downloadFiles,
  renameFile,
  deleteFile,
};
