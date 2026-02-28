import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail, findUserById } from '../services/dataService.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const VALID_ROLES = ['customer', 'technician'];
const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name, city } = req.body;
    if (!email || !password || !role || !name || !city) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash, role, name, city });
    const token = signToken({ id: user.id, role: user.role, email: user.email });
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    return res.json({ token, user: await findUserById(user.id) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
