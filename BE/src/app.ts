import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import router from './routes';

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    const app = express();

    app.use(express.json());

    app.use(
      cors({
        origin: 'http://localhost:5173', // allow frontend Vite app
        credentials: true, // allow cookies if needed
      })
    );

    app.use('', router);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // exit the process if DB connection fails
  });

//this must be invoked for the GridFs library and is supposed to be used right after the db is connected
// let bucket;
// (() => {
//   mongoose.connection.on('connected', () => {
//     if (!mongoose.connection.db) {
//       throw new Error('Database connection is not available.');
//     }

//     bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//       bucketName: 'filesBucket',
//     });
//   });
// })();
