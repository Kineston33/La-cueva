import { supabase } from '../config/supabase.js';

export async function getProfileByUserId(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

export async function upsertProfile(payload) {
  return supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select('*').single();
}

export async function getTechnicians({ category, location }) {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'technician')
    .order('is_available', { ascending: false })
    .order('updated_at', { ascending: false });

  if (category) {
    query = query.ilike('service_category', category);
  }

  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  return query;
}

export async function listUsers() {
  return supabase.from('profiles').select('id, role, full_name, location, service_category, is_available, created_at');
}
