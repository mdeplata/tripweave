import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';

import type { Express, Request, Response } from 'express';

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      message: 'TripWeave API is running!',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
