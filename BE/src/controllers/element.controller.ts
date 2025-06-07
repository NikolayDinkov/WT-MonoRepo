import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest';

import * as ElementService from '../services/element.service';
import * as FileService from '../services/file.service';

const getAllElements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const elements = await ElementService.getAllElementsForOwner(
      new Types.ObjectId(req.userId)
    );
    res.status(200).json(elements);
  } catch (exError: any) {
    res
      .status(400)
      .json({ error: exError.message || 'Failed to fetch elements' });
  }
};

const getAllSharedWithUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const elements = await ElementService.getAllSharedElementsForUser(
      new Types.ObjectId(req.userId)
    );
    res.status(200).json(elements);
  } catch (exError: any) {
    res
      .status(400)
      .json({ error: exError.message || 'Failed to fetch shared elements' });
  }
};

const getMetadataById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const metadata = await ElementService.getMetadataById(
      new Types.ObjectId(req.userId),
      new Types.ObjectId(req.params.elementId)
    );
    res.status(200).json(metadata);
  } catch (exError: any) {
    res
      .status(400)
      .json({ error: exError.message || 'Failed to fetch metadata' });
  }
};

export const createDirectory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const owner = new Types.ObjectId(req.userId);
    const { name, parent } = req.body;

    const parentId = parent ? new(parent) : null;

    const newDir = await ElementService.createDirectory({
      name,
      parent: parentId,
      owner,
    });

    res.status(201).json(newDir);
  } catch (err: any) {
    res
      .status(400)
      .json({ error: err.message || 'Failed to create directory' });
  }
};

const uploadFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const userId = new Types.ObjectId(req.userId);
    const parentId = req.body.parentId ? new Types.ObjectId(req.body.parentId) : null;
    const path = req.body.path || '/';

    const element = await ElementService.uploadFileForOwner(
      userId,
      req.file,
      parentId,
      path
    );

    res.status(201).json({ message: 'File uploaded successfully', element });
  } catch (exError: any) {
    console.error('[UploadFile Controller] Error:', exError);
    res.status(500).json({ error: exError.message || 'Internal server error' });
  }
};

const uploadFiles = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId);
    const parentId = req.body.parentId
      ? new Types.ObjectId(req.body.parentId)
      : null;
    console.log(req.body.parentId);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const elements = await ElementService.uploadFilesForOwner(
      userId,
      files,
      parentId
    );

    res.status(201).json({ message: 'Files uploaded successfully', elements });
  } catch (err: any) {
    console.error('[UploadFiles Controller] Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

const downloadFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { stream, file } = await FileService.downloadFileById(
      req.params.fileId
    );
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename=${file.filename}`);
    stream.pipe(res);
  } catch (exError: any) {
    res.status(400).json({ error: exError.message || 'File not found' });
  }
};

const downloadFiles = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const { archive } = await FileService.downloadMultipleFiles();
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=files.zip');
    res.set('Access-Control-Allow-Origin', '*');
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

export const deleteElement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.userId);
    const elementId = new Types.ObjectId(req.params.elementId);

    await ElementService.deleteElementById(elementId, userId);

    res.status(200).json({ message: 'Element deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to delete element' });
  }
};

export default {
  getAllElements,
  getAllSharedWithUser,
  getMetadataById,
  createDirectory,
  uploadFile,
  uploadFiles,
  downloadFile,
  downloadFiles,
  renameFile,
  deleteElement
};
