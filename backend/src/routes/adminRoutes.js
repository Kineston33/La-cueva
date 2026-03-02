import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listUsers } from '../services/profileService.js';

const router = express.Router();

router.get('/users', requireAuth, async (req, res) => {
  const { data: myProfile, error: profileError } = await req.app.locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (profileError) return res.status(404).json({ error: profileError.message });
  if (myProfile.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const { data, error } = await listUsers();
  if (error) return res.status(400).json({ error: error.message });

  return res.json({ users: data, technicians: data.filter((u) => u.role === 'technician') });
});

export default router;
