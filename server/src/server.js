import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import { closeDatabase, initializeDatabase } from './config/db.js';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '../..');
dotenv.config({ path: resolve(projectRoot, 'server/.env') });
dotenv.config({ path: resolve(projectRoot, '.env.local') });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured in server/.env and contain at least 32 characters.');
}

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/records', recordRoutes);

app.use((req, res) => res.status(404).json({ error: `No API route for ${req.method} ${req.path}.` }));
app.use((error, _req, res, _next) => {
  console.error('API request failed:', error);
  if (res.headersSent) return;
  const status = Number.isInteger(error.status) ? error.status : 500;
  res.status(status).json({
    error: status >= 500 ? 'The server could not complete this request. Please try again.' : error.message
  });
});

await initializeDatabase();
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => console.log(`MedCheck API listening on http://localhost:${port}`));

async function shutdown() {
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
