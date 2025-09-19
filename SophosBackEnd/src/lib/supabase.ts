import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClients = {
  anon: SupabaseClient | null;
  service: SupabaseClient | null;
};

export const getSupabaseClients = (): SupabaseClients => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return { anon: null, service: null };

  return {
    anon: anonKey ? createClient(url, anonKey) : null,
    service: serviceKey ? createClient(url, serviceKey) : null,
  };
};

export const hasSupabaseConfig = (): boolean => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE);
};


