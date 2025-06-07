import Element, { IElement } from '../models/element.model';
import { Types } from 'mongoose';

import { getFileMetadataById, getFilesByIds } from './file.service';
import { CreateDirectoryInput } from '../interfaces/createDirectoryInput';

export const getAllElementsForOwner = (userId: Types.ObjectId) => {
  return Element.find({ owner: userId }).lean().exec();
};

export const getAllSharedElementsForUser = (userId: Types.ObjectId) => {
  return Element.find({ sharedWith: { $in: [userId] } })
    .lean()
    .exec();
};

export const getMetadataById = async (
  userId: Types.ObjectId,
  elementId: Types.ObjectId
) => {
  const element = await Element.findOne({ _id: elementId }).lean().exec();
  if (!element) {
    throw new Error('Element not found');
  }

  if (!checkIfFileIsSharedWithUser(userId, elementId)) {
    throw new Error('You do not have permission to access this element');
  }

  if (element.type === 'file' && element.gridFsId) {
    return getFileMetadataById(element.gridFsId);
  } else if (element.type === 'directory') {
    return getDirectoryMetadata(element.id);
  }
};

async function getDirectoryMetadata(dirId: Types.ObjectId) {
  const files: IElement[] = [];

  await collectFilesRecursively(dirId, files);

  const gridFsIds = files
    .map((f) => f.gridFsId)
    .filter((id) => id !== null) as Types.ObjectId[];

  const gridFsFiles = await getFilesByIds(gridFsIds);

  const totalSize = gridFsFiles.reduce((sum, file) => sum + file.length, 0);

  return {
    totalSize,
    fileCount: gridFsFiles.length,
  };
}

async function collectFilesRecursively(
  parentId: Types.ObjectId,
  result: IElement[]
) {
  const children = await Element.find({ parent: parentId }).lean();

  for (const child of children) {
    if (child.type === 'file') {
      result.push(child);
    } else if (child.type === 'directory') {
      await collectFilesRecursively(new child.id(), result);
    }
  }
}

async function checkIfFileIsSharedWithUser(
  userId: Types.ObjectId,
  elementId: Types.ObjectId
): Promise<boolean> {
  let element = await Element.findById(elementId).lean().exec();
  if (!element) {
    return false; // Element not found
  }

  // If the user is the owner, always has access
  if (element.owner.equals(userId)) {
    return true;
  }

  // Traverse up the parent chain
  while (element.parent) {
    const parent = await Element.findById(element.parent).lean().exec();
    if (!parent) {
      break;
    }

    if (parent.sharedWith.some((id) => id.equals(userId))) {
      return true;
    }

    element = parent; // climb up
  }

  return false; // no access found
}

export const createDirectory = async (
  input: CreateDirectoryInput
): Promise<IElement> => {
  const { name, parent, owner } = input;

  let path = `/${name}`;
  if (parent) {
    const parentElement = await Element.findById(parent).lean().exec();
    if (!parentElement || parentElement.type !== 'directory') {
      throw new Error('Invalid parent directory');
    }
    if (parentElement) {
      path = `${parentElement.path}/${name}`;
    }
  }
  console.log(`Creating directory at path: ${path}`);

  const newDirectory = await Element.create({
    name,
    path,
    parent,
    owner,
    sharedWith: [],
    gridFsId: null,
    type: 'directory',
  });

  return newDirectory;
};

export const getElementsByName = (name: string) => {
  return Element.find({ name }).lean().exec();
};

export const getFilesByName = (name: string) => {
  return Element.find({ name, type: 'File' }).lean().exec();
};

export const getDirectoriesByName = (name: string) => {
  return Element.find({ name, type: 'Directory' }).lean().exec();
};

export const deleteElementByGridFsId = (gridFsId: Types.ObjectId) => {
  return Element.deleteOne({ gridFsId }).exec();
};

export const uploadFileForOwner = async (
  userId: Types.ObjectId,
  file: Express.Multer.File,
  parentId: Types.ObjectId | null,
  path: string
) => {
  const fileWithId = file as Express.Multer.File & { id: Types.ObjectId };

  const element = new Element({
    name: file.originalname,
    path: path,
    parent: parentId,
    owner: userId,
    sharedWith: [],
    gridFsId: fileWithId.id,
    type: 'file',
  });

  await element.save();

  return element;
};

export const uploadFilesForOwner = async (
  userId: Types.ObjectId,
  files: Express.Multer.File[],
  parentId: Types.ObjectId | null,
  path: string
) => {
  const elements = files.map((file) => {
    const fileWithId = file as Express.Multer.File & { id: Types.ObjectId };

    return new Element({
      name: file.originalname,
      path: path,
      parent: parentId,
      owner: userId,
      sharedWith: [],
      gridFsId: fileWithId.id,
      type: 'file',
    });
  });

  await Element.insertMany(elements);

  return elements;
};

export const createElement = (elementData: {
  name: string;
  path: string;
  owner: Types.ObjectId;
  parent: Types.ObjectId | null;
  sharedWith: Types.ObjectId[];
  gridFsId: Types.ObjectId | null;
  type: 'File' | 'Directory';
}) => new Element(elementData).save();
