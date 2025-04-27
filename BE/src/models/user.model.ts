import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IElement } from "./element.model";
import { Shared } from "./shared.model";

export interface IUser extends Document {
  id: Types.ObjectId;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  registerDate: Date;
  personalCollection: Types.ObjectId[];
  sharedWithMeCollection: Types.ObjectId[];
}
