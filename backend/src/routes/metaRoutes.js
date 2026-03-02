import express from 'express';
import { CATEGORIES } from '../constants.js';

const router = express.Router();

router.get('/categories', (req, res) => {
  res.json(CATEGORIES);
});

export default router;
