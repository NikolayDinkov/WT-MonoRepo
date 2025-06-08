import cors from 'cors';
import router from './routes';

import express from 'express';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://wt-monorepo-fe.onrender.com',
];

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
