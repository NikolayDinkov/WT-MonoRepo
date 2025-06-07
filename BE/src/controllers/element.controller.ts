import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';

import * as ElementService from '../services/element.service';
import * as FileService from '../services/file.service';

const getAllElements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const elements = await ElementService.getAllElementsForOwner(new Types.ObjectId(req.userId));
    res.status(200).json(elements);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'Failed to fetch elements' });
  }
};

const getAllSharedWithUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const elements = await ElementService.getAllSharedElementsForUser(new Types.ObjectId(req.userId));
    res.status(200).json(elements);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'Failed to fetch shared elements' });
  }
}

const getMetadataByName = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const metadata = await ElementService.getMetadataById(new Types.ObjectId(req.userId), new Types.ObjectId(req.params.elementId));
    res.status(200).json(metadata);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'Failed to fetch metadata' });
  }
}

const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.userId);
    if (req.file) {
      await FileService.uploadFileForOwner(userId, req.file);
      res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      res.status(400).json({ error: 'No file provided' });
    }
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'File upload failed' });
  }
};

const uploadFiles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.userId);
    if (req.files && Array.isArray(req.files)) {
      await FileService.uploadFilesForOwner(userId, req.files as Express.Multer.File[]);
      res.status(200).json({ message: 'Files uploaded successfully' });
    } else {
      res.status(400).json({ error: 'No files provided' });
    }
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'Files upload failed' });
  }
};

const downloadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { stream, file } = await FileService.downloadFileById(req.params.fileId);
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename=${file.filename}`);
    stream.pipe(res);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'File not found' });
  }
};

const downloadFiles = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const { archive } = await FileService.downloadMultipleFiles();
    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=files.zip");
    res.set("Access-Control-Allow-Origin", "*");
    archive.pipe(res);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'No files to download' });
  }
};

const renameFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileId, newName } = req.body;
    const result = await FileService.renameFileById(fileId, newName);
    res.status(200).json(result);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'Rename failed' });
  }
};

const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileId } = req.params;
    const result = await FileService.deleteFileById(fileId);
    res.status(200).json(result);
  } catch (exError: any) {
    res.status(404).json({ error: exError.message || 'Delete failed' });
  }
};

export default {
  getAllElements,
  getAllSharedWithUser,
  uploadFile,
  uploadFiles,
  downloadFile,
  downloadFiles,
  renameFile,
  deleteFile,
};
