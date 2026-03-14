import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import credentialsRouter from './routes/credentials';
import statsRouter from './routes/stats';
import shareRouter from './routes/share';
import uploadRouter from './routes/upload';
import logsRouter from './routes/logs';
import profileRouter from './routes/profile';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || './uploads')));

// API Routes
app.use('/api/credentials', credentialsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/credentials', shareRouter); // Shares are nested under credentials
app.use('/api/share', shareRouter); // Public share access
app.use('/api/upload', uploadRouter);
app.use('/api/logs', logsRouter);
app.use('/api/profile', profileRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🏦 Vault server running on http://localhost:${PORT}`);
});
