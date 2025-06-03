import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = () => {
  return mongoose.connect(MONGO_URI);
};

export const getGridFSBucket = (): mongoose.mongo.GridFSBucket => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not available.');
  }
  
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'filesBucket',
  });
};