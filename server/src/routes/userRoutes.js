import { Router } from 'express';
import {
  getTechnicianProfile,
  updateTechnicianProfile,
  updateUserProfile
} from '../services/dataService.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const compactPayload = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const payload = compactPayload({
      name: req.body.name,
      city: req.body.city,
      photo_url: req.body.photo_url
    });
    const user = await updateUserProfile(req.user.id, payload);
    return res.json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/technician/profile', requireAuth, requireRole('technician'), async (req, res) => {
  try {
    const profile = await getTechnicianProfile(req.user.id);
    return res.json({ profile });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/technician/profile', requireAuth, requireRole('technician'), async (req, res) => {
  try {
    const payload = compactPayload({
      category: req.body.category,
      description: req.body.description,
      price_range: req.body.price_range,
      whatsapp: req.body.whatsapp,
      availability: req.body.availability
    });
    const profile = await updateTechnicianProfile(req.user.id, payload);
    return res.json({ profile });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
