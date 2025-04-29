import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected");
  } catch (err : any) {
    console.error(err.message);
    process.exit(1);
  }
};

// export const getGridFSBucket = (): GridFSBucket => {
//   if (!mongoose.connection.db) {
//     throw new Error('Database connection is not available.');
//   }
  
//   return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: 'filesBucket',
//   });
// };