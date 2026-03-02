import express from 'express';
import { supabase } from '../config/supabase.js';
import { upsertProfile } from '../services/profileService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, role, fullName, location } = req.body;

  if (!email || !password || !role || !fullName || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  const userId = data.user?.id;
  if (!userId) return res.status(500).json({ error: 'Could not create user' });

  const { error: profileError, data: profile } = await upsertProfile({
    id: userId,
    role,
    full_name: fullName,
    location,
  });

  if (profileError) {
    return res.status(400).json({ error: profileError.message });
  }

  return res.status(201).json({
    user: data.user,
    session: data.session,
    profile,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) return res.status(404).json({ error: profileError.message });

  return res.json({
    user: data.user,
    session: data.session,
    profile,
  });
});

export default router;
