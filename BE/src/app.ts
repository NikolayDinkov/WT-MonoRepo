import cors from 'cors';
import router from './routes';

import express, { Request, Response } from 'express';
import { connectDB } from './config/database';
// import { initGridFSBucket } from './services/gridfs.service';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // initGridFSBucket(); // Initialize GridFSBucket for the first time after DB connection
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