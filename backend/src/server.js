import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import { supabase } from './config/supabase.js';

const app = express();
const port = process.env.PORT || 4000;

app.locals.supabase = supabase;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true, service: 'fixaro-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meta', metaRoutes);

app.listen(port, () => {
  console.log(`Fixaro backend running on http://localhost:${port}`);
});
