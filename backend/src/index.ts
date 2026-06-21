import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profilesRouter from './routes/profiles';
import resumeRouter from './routes/resume';
import generateRouter from './routes/generate';
import draftsRouter from './routes/drafts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/profiles', profilesRouter);
app.use('/resume', resumeRouter);
app.use('/generate', generateRouter);
app.use('/drafts', draftsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
