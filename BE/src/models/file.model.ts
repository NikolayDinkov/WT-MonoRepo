import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// Define the interface for the File document
export interface IFile extends Document {
  name: string;
  path: string;
  parent: Types.ObjectId | null; // Reference to parent directory
  owner: Types.ObjectId; // Owner user
  gridFsId: Types.ObjectId; // Reference to GridFS stored file
}

// Define the File schema
const fileSchema = new Schema<IFile>(
  {
    name: { type: Schema.Types.String, required: true },
    path: { type: Schema.Types.String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Directory', default: null },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gridFsId: { type: Schema.Types.ObjectId, required: true }, // GridFS file ID
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create an index for efficient parent lookups
fileSchema.index({ parent: 1 });

// Create and export the File model
const File: Model<IFile> = mongoose.model<IFile>('File', fileSchema);

export default File;
