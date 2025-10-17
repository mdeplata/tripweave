import express from 'express';
import dotenv from 'dotenv';

import type { Express } from 'express';

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
