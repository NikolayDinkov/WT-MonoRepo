import Element, { IElement } from '../models/element.model';
import { Types } from 'mongoose';
import { getGridFSBucket } from '../config/database';

import { getFileMetadataById, getFilesByIds, renameFileById, downloadFileById } from './file.service';
import { getUserIdByUsername } from './user.service';

import { CreateDirectoryInput } from '../interfaces/createDirectoryInput';

export const getAllElementsForOwner = (userId: Types.ObjectId) => {
  return Element.find({ owner: userId }).lean().exec();
};

export const getAllSharedElementsForUser = async (userId: Types.ObjectId) => {
  const rootDirs = await Element.find({ sharedWith: { $in: [userId] } })
    .lean()
    .exec();

  const allSharedElements: IElement[] = [rootDirs].flat();

  for (const root of rootDirs) {
    await collectSharedElementsRecursively(root._id as Types.ObjectId, allSharedElements);
  }

  return allSharedElements;
}

async function collectSharedElementsRecursively(
  parentId: Types.ObjectId,
  result: IElement[]
) {
  if (!parentId)
    return;

  const children = await Element.find({ parent: parentId }).lean().exec();

  for (const child of children) {
    result.push(child);

    if (child.type === 'directory') {
      await collectSharedElementsRecursively(child._id as Types.ObjectId, result);
    }
  }
}

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
      await collectFilesRecursively(new Types.ObjectId(child.id), result);
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

export const shareElementWithUser = async (
  userId: Types.ObjectId,
  elementId: Types.ObjectId,
  sharedWithUserName: string
): Promise<IElement> => {
  const element = await Element
    .findById(elementId)
    .exec();

  if (!element) {
    throw new Error('Element not found');
  }
  if (!element.owner.equals(userId)) {
    throw new Error('Not authorized to share this element');
  }

  const sharedWithUserId = await getUserIdByUsername(sharedWithUserName);

  if (element.sharedWith.some((id) => id.equals(sharedWithUserId))) {
    throw new Error('Element already shared with this user');
  }

  // Check if the user already has access through a parent directory
  let currentElement = element as IElement;
  while (currentElement.parent) {
    const parent = await Element.findById(currentElement.parent).lean().exec();
    if (!parent) {
      break;
    }
    if (parent.sharedWith.some((id) => id.equals(sharedWithUserId))) {
      return element; // User already has access through a parent directory
    }
    currentElement = parent;
  }

  element.sharedWith.push(sharedWithUserId);
  await element.save();
  return element;
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

export const deleteElementById = async (
  elementId: Types.ObjectId,
  ownerId: Types.ObjectId
): Promise<void> => {
  const element = await Element.findById(elementId).exec();
  if (!element) {
    throw new Error('Element not found');
  }

  if (!element.owner.equals(ownerId)) {
    throw new Error('Not authorized to delete this element');
  }

  if (element.type === 'file') {
    if (element.gridFsId) {
      const bucket = getGridFSBucket();
      const files = await bucket.find({ _id: element.gridFsId }).toArray();
      if (files.length > 0) {
        await bucket.delete(element.gridFsId);
      }
    }

    await Element.deleteOne({ _id: elementId });
  } else if (element.type === 'directory') {
    const children = await Element.find({ parent: element._id }).exec();

    for (const child of children) {
      await deleteElementById(child.id, ownerId); // recursive deletion
    }

    await Element.deleteOne({ _id: elementId });
  }
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
    path: `${path}/${file.originalname}`,
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
  parentId: Types.ObjectId | null
) => {
  let parentPath = '';
  
  if (parentId) {
    const parentElement = await Element.findById(parentId).lean().exec();
    if (!parentElement || parentElement.type !== 'directory') {
      throw new Error('Invalid parent directory');
    }
    if (parentElement) {
      parentPath = `${parentElement.path}`;
    }
  }
  const elements = files.map((file) => {
    const fileWithId = file as Express.Multer.File & { id: Types.ObjectId };
    let path = `/${file.originalname}`;
    if (parentId) {
      path = `${parentPath}/${file.originalname}`;
    }
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

export const getFileStreamById = async (
  elementId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<{ stream: any; file: any }> => {
  const element = await Element
    .findById(elementId)
    .lean()
    .exec();
  if (!element) {
    throw new Error('Element not found');
  }

  if (!checkIfFileIsSharedWithUser(userId, elementId)) {
    throw new Error('You do not have permission to access this element');
  }

  if (element.type !== 'file' || !element.gridFsId) {
    throw new Error('Element is not a file or does not have a GridFS ID');
  }

  return downloadFileById(element.gridFsId);
}

export const renameElementById = async (
  elementId: Types.ObjectId,
  newName: string,
  ownerId: Types.ObjectId
): Promise<IElement> => {
  const element = await Element
    .findById(elementId)
    .exec();

  if (!element) {
    throw new Error('Element not found');
  }
  if (!element.owner.equals(ownerId)) {
    throw new Error('Not authorized to rename this element');
  }
  if (element.name === newName) {
    return element;
  }
  // Check if a file with the same name already exists in the same directory
  const existingElement = await Element.findOne({
    name:
    newName,
    parent: element.parent,
    type: element.type,
  }).exec();
  if (existingElement) {
    throw new Error('An element with the same name already exists in this directory');
  }
  
  // Update the element's name and path
  element.name = newName;
  if (element.parent) {
    const parentElement = await Element.findById(element.parent).lean().exec();
    if (parentElement) {
      element.path = `${parentElement.path}/${newName}`;
    } else {
      element.path = `/${newName}`;
    }
  } else {
    element.path = `/${newName}`;
  }
  await element.save();

  if (element.type === 'file' && element.gridFsId) {
    renameFileById(element.gridFsId, newName);
  }

  return element;
}

export const createElement = (elementData: {
  name: string;
  path: string;
  owner: Types.ObjectId;
  parent: Types.ObjectId | null;
  sharedWith: Types.ObjectId[];
  gridFsId: Types.ObjectId | null;
  type: 'File' | 'Directory';
}) => new Element(elementData).save();
