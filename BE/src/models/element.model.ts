import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IElement extends Document {
  id: Types.ObjectId;
  publishedBy: Types.ObjectId;
  publishedAt: Date;
  accessibleTo: Types.ObjectId[];
}
