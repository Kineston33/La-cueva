import { Router } from 'express';
import { listTechnicians, listUsers } from '../services/dataService.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/users', requireAuth, requireRole('admin'), async (_req, res) => {
  const users = await listUsers();
  return res.json({ users });
});

router.get('/technicians', requireAuth, requireRole('admin'), async (_req, res) => {
  const technicians = await listTechnicians();
  return res.json({ technicians });
});

export default router;
