import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfileByUserId, getTechnicians, upsertProfile } from '../services/profileService.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await getProfileByUserId(req.user.id);

  if (error) return res.status(404).json({ error: error.message });
  return res.json(data);
});

router.put('/me', requireAuth, async (req, res) => {
  const payload = {
    id: req.user.id,
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await upsertProfile(payload);
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.get('/technicians', async (req, res) => {
  const { category, location } = req.query;
  const { data, error } = await getTechnicians({ category, location });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

export default router;
