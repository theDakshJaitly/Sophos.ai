// In SophosBackEnd/src/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL or Service Role Key is missing from environment variables.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);