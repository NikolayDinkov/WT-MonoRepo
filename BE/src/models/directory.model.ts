import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IElement } from "./element.model";

interface IDirectory extends IElement {
  elements: Types.ObjectId[];
}
