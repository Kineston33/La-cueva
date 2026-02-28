import { Router } from 'express';
import { listCategories, searchTechnicians } from '../services/dataService.js';

const router = Router();

router.get('/categories', async (_req, res) => {
  const categories = await listCategories();
  return res.json({ categories });
});

router.get('/technicians', async (req, res) => {
  try {
    const { category = '', city = '' } = req.query;
    const technicians = await searchTechnicians({ category, city });
    return res.json({ technicians });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
