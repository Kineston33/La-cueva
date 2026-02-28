import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { supabase } from '../config/supabase.js';
import { isSupabaseEnabled } from '../config/env.js';

const seedHash = bcrypt.hashSync('12345678', 10);

const memory = {
  users: [
    {
      id: 'u1',
      email: 'cliente@fixaro.com',
      password_hash: seedHash,
      role: 'customer',
      name: 'Ana Cliente',
      city: 'Bogotá',
      photo_url: ''
    },
    {
      id: 'u2',
      email: 'tecnico@fixaro.com',
      password_hash: seedHash,
      role: 'technician',
      name: 'Carlos Técnico',
      city: 'Bogotá',
      photo_url: ''
    },
    {
      id: 'u3',
      email: 'admin@fixaro.com',
      password_hash: seedHash,
      role: 'admin',
      name: 'Admin Fixaro',
      city: 'Bogotá',
      photo_url: ''
    }
  ],
  technicianProfiles: [
    {
      user_id: 'u2',
      category: 'Electrician',
      description: 'Reparación de cortos y cableado residencial.',
      price_range: '$20-$60',
      whatsapp: '573001234567',
      availability: 'available'
    }
  ]
};

const categories = [
  'Electrician',
  'Plumber',
  'Appliance repair',
  'Phone repair',
  'Painter',
  'General technician'
];

const publicUser = (u) => {
  if (!u) return null;
  const { password_hash, ...rest } = u;
  return rest;
};

const toTechnician = (user, profile) => ({
  id: user.id,
  name: user.name,
  city: user.city,
  role: user.role,
  category: profile?.category || '',
  description: profile?.description || '',
  priceRange: profile?.price_range || '',
  whatsapp: profile?.whatsapp || '',
  availability: profile?.availability || 'available'
});

export const listCategories = async () => categories;

export const createUser = async ({ email, passwordHash, role, name, city, photoUrl = '' }) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash, role, name, city, photo_url: photoUrl })
      .select()
      .single();
    if (error) throw new Error(error.message);

    if (role === 'technician') {
      const { error: profileError } = await supabase.from('technician_profiles').insert({ user_id: data.id });
      if (profileError) throw new Error(profileError.message);
    }

    return publicUser(data);
  }

  const exists = memory.users.find((u) => u.email === email);
  if (exists) throw new Error('Email already in use');

  const newUser = {
    id: randomUUID(),
    email,
    password_hash: passwordHash,
    role,
    name,
    city,
    photo_url: photoUrl
  };
  memory.users.push(newUser);
  if (role === 'technician') {
    memory.technicianProfiles.push({
      user_id: newUser.id,
      category: categories[0],
      description: '',
      price_range: '',
      whatsapp: '',
      availability: 'available'
    });
  }
  return publicUser(newUser);
};

export const findUserByEmail = async (email) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }
  return memory.users.find((u) => u.email === email) || null;
};

export const findUserById = async (id) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return publicUser(data);
  }
  return publicUser(memory.users.find((u) => u.id === id));
};

export const getTechnicianProfile = async (userId) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.from('technician_profiles').select('*').eq('user_id', userId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }
  return memory.technicianProfiles.find((p) => p.user_id === userId) || null;
};

export const updateUserProfile = async (id, payload) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.from('users').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return publicUser(data);
  }

  const idx = memory.users.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error('User not found');
  memory.users[idx] = { ...memory.users[idx], ...payload };
  return publicUser(memory.users[idx]);
};

export const updateTechnicianProfile = async (userId, payload) => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase
      .from('technician_profiles')
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  const idx = memory.technicianProfiles.findIndex((p) => p.user_id === userId);
  if (idx < 0) throw new Error('Technician profile not found');
  memory.technicianProfiles[idx] = { ...memory.technicianProfiles[idx], ...payload };
  return memory.technicianProfiles[idx];
};

export const searchTechnicians = async ({ category, city }) => {
  if (isSupabaseEnabled) {
    let query = supabase
      .from('users')
      .select('id,name,city,role,technician_profiles(category,description,price_range,whatsapp,availability)')
      .eq('role', 'technician');

    if (city) query = query.ilike('city', `%${city}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const normalized = data
      .map((u) => toTechnician(u, Array.isArray(u.technician_profiles) ? u.technician_profiles[0] : u.technician_profiles))
      .filter((t) => (category ? t.category === category : true));

    return normalized;
  }

  return memory.users
    .filter((u) => u.role === 'technician')
    .map((u) => toTechnician(u, memory.technicianProfiles.find((p) => p.user_id === u.id)))
    .filter((t) => (category ? t.category === category : true))
    .filter((t) => (city ? t.city.toLowerCase().includes(city.toLowerCase()) : true));
};

export const listUsers = async () => {
  if (isSupabaseEnabled) {
    const { data, error } = await supabase.from('users').select('id,email,role,name,city,photo_url');
    if (error) throw new Error(error.message);
    return data;
  }

  return memory.users.map((u) => publicUser(u));
};

export const listTechnicians = async () => searchTechnicians({});
