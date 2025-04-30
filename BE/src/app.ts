import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB, getGridFSBucket } from './config/database';
import mongoose from 'mongoose';
import router from './routes';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  getGridFSBucket(); // Initialize GridFSBucket after DB connection
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173', // allow frontend Vite app
    credentials: true, // allow cookies if needed
  })
);
app.use('/', router);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});