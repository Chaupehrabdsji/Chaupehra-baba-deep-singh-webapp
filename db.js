// ── Data layer — all Supabase queries in one place ────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON } from './supabase-config.js';

const configured = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('[');
export const sb = configured ? createClient(SUPABASE_URL, SUPABASE_ANON) : null;

function requireSb() {
  if (!sb) throw new Error('Supabase not configured — fill in supabase-config.js');
}

// ── Events ────────────────────────────────────────────────────────────────────
export async function getUpcomingEvents() {
  requireSb();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await sb
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(6);
  if (error) throw error;
  return data;
}

export async function getAllEvents() {
  requireSb();
  const { data, error } = await sb
    .from('events')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertEvent(event) {
  requireSb();
  const { data, error } = await sb.from('events').upsert(event).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  requireSb();
  const { error } = await sb.from('events').delete().eq('id', id);
  if (error) throw error;
}

// ── Photos ────────────────────────────────────────────────────────────────────
export async function getPhotos() {
  requireSb();
  const { data, error } = await sb
    .from('photos')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data.map(p => ({
    ...p,
    url: sb.storage.from('gallery').getPublicUrl(p.storage_path).data.publicUrl
  }));
}

export async function uploadPhoto(file, caption = '') {
  requireSb();
  const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const { error: uploadErr } = await sb.storage.from('gallery').upload(path, file);
  if (uploadErr) throw uploadErr;
  const { error: dbErr } = await sb.from('photos').insert({ storage_path: path, caption });
  if (dbErr) throw dbErr;
}

export async function deletePhoto(photo) {
  requireSb();
  await sb.storage.from('gallery').remove([photo.storage_path]);
  const { error } = await sb.from('photos').delete().eq('id', photo.id);
  if (error) throw error;
}

// ── Available Dates ───────────────────────────────────────────────────────────
export async function getAvailableDates() {
  requireSb();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await sb
    .from('available_dates')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllAvailableDates() {
  requireSb();
  const { data, error } = await sb
    .from('available_dates')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function setDateAvailability(date, is_available, notes = '') {
  requireSb();
  const { error } = await sb.from('available_dates').upsert(
    { date, is_available, notes },
    { onConflict: 'date' }
  );
  if (error) throw error;
}

export async function removeDateEntry(id) {
  requireSb();
  const { error } = await sb.from('available_dates').delete().eq('id', id);
  if (error) throw error;
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function submitBooking(booking) {
  requireSb();
  const { error } = await sb.from('bookings').insert(booking);
  if (error) throw error;
}

export async function getAllBookings() {
  requireSb();
  const { data, error } = await sb
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id, status) {
  requireSb();
  const { error } = await sb.from('bookings').update({ status }).eq('id', id);
  if (error) throw error;
}
