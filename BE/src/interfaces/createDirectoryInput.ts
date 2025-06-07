import { Types } from 'mongoose';

export interface CreateDirectoryInput {
  name: string;
  parent: Types.ObjectId | null;
  owner: Types.ObjectId;
}