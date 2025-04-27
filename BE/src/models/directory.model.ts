import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// Define the interface for the Directory document
export interface IDirectory extends Document {
  name: string;
  path: string;
  parent: Types.ObjectId | null; // Reference to the parent directory
  owner: Types.ObjectId; // Reference to the user who owns the directory
  permissions: Types.ObjectId[]; // Array of user references with access permissions
  createdAt: Date;
  updatedAt: Date;
}

// Define the Directory schema
const directorySchema = new Schema<IDirectory>(
  {
    name: { type: Schema.Types.String, required: true },
    path: { type: Schema.Types.String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Directory', default: null },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt
);

// Create indexes for efficient querying
directorySchema.index({ parent: 1 });
directorySchema.index({ permissions: 1 });

// Create and export the Directory model
const Directory: Model<IDirectory> = mongoose.model<IDirectory>(
  'Directory',
  directorySchema
);

export default Directory;
