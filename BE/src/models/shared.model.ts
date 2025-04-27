import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface Shared extends Document {
  id: Types.ObjectId;
  sharedBy: Types.ObjectId;
  sahredAt: Date;
  element: Types.ObjectId;
}
