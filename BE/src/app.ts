import cors from 'cors';
import router from './routes';

import express, { Request, Response } from 'express';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://wt-monorepo-fe.onrender.com'] // allow FE vite local app and hosted app
    credentials: true, // allow cookies if needed
  })
);
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
