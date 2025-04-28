import express, { Request, Response } from 'express';
import { connectDB } from './utils/database';
import mongoose from 'mongoose';
import { upload } from './utils/upload';

const app = express();

connectDB();

let bucket;
(() => {
  mongoose.connection.on('connected', () => {
    if (!mongoose.connection.db) {
      throw new Error('Database connection is not available.');
    }

    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'filesBucket',
    });
  });
})();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript and MongoDB!');
});

// Upload single file
app.post('/upload/file', upload().single('file'), async (req, res) => {
  try {
    res.status(201).json({ text: 'File uploaded successfully !' });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: { text: 'Unable to upload the file', error },
    });
  }
});

// Upload multiple files
app.post('/upload/files', upload().array('files'), async (req, res) => {
  try {
    res.status(201).json({ text: 'Files uploaded successfully !' });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: { text: `Unable to upload files`, error },
    });
  }
});

// Start the server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
