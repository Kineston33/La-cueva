import { Router } from 'express';
import { getTechnicianBySlug, listCategories, searchTechnicians } from '../services/dataService.js';

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

router.get('/technicians/:nombre', async (req, res) => {
  try {
    const technician = await getTechnicianBySlug(req.params.nombre);
    if (!technician) return res.status(404).json({ message: 'Technician not found' });
    return res.json({ technician });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
