// import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_URI as string;

// let bucket: mongoose.mongo.GridFSBucket | null = null;

// export const initGridFSBucket = () => {
//   if (!mongoose.connection.db) {
//     throw new Error('MongoDB connection not available.');
//   }
//   bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: 'filesBucket',
//   });
// };

// export const getGridFSBucket = (): mongoose.mongo.GridFSBucket => {
//   if (!bucket) {
//     throw new Error('GridFSBucket not initialized.');
//   }
//   return bucket;
// };
