import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the interface for the File document
export interface IFile extends Document {
  name: string;
  path: string;
  parent: Types.ObjectId | null;
  owner: Types.ObjectId;

  gridFsId: Types.ObjectId; // <<-- NEW! ID pointing to the GridFS file
  permissions: Types.ObjectId[];
  createdAt: Date;
}

// Define the File schema
const fileSchema = new Schema<IFile>({
  name: { type: Schema.Types.String, required: true },
  path: { type: Schema.Types.String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Directory', default: null },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  gridFsId: { type: Schema.Types.ObjectId, required: true }, // <<-- reference to the actual file in GridFS
  permissions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

// Optional index for fast parent lookups
fileSchema.index({ parent: 1 });

const File = mongoose.model<IFile>('File', fileSchema);

export default File;
