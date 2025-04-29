import mongoose, { Schema, Document, Types, Model } from 'mongoose';

// Define the interface for the Element document
export interface IElement extends Document {
  name: string;
  path: string;
  parent: Types.ObjectId | null; // Reference to the parent Element
  owner: Types.ObjectId; // Reference to the user who owns the Element
  sharedWith: Types.ObjectId[]; // Array of user references with access
  gridFsId: Types.ObjectId | null; // Reference to GridFS stored file
  type: string;
}

// Define the Element schema
const elementSchema = new Schema<IElement>(
  {
    name: { type: Schema.Types.String, required: true },
    path: { type: Schema.Types.String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Element', default: null },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    gridFsId: { type: Schema.Types.ObjectId, default: null }, // GridFS file ID
    type: { type: Schema.Types.String, required: true },
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt
);

// Create indexes for efficient querying
elementSchema.index({ parent: 1 });
elementSchema.index({ sharedWith: 1 });

// Create and export the Element model
const Element: Model<IElement> = mongoose.model<IElement>(
  'Element',
  elementSchema
);

export default Element;
