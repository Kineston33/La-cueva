import express from 'express';
import cors from 'cors';
import { env, isSupabaseEnabled } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: isSupabaseEnabled ? 'supabase' : 'memory-demo' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/admin', adminRoutes);

app.listen(env.port, () => {
  console.log(`Fixaro API running at http://localhost:${env.port}`);
});
