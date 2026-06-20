import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Project URL (REST API)
const supabaseUrl = 'https://yzsmxcmjxsjdaalbtivc.supabase.co';

// Anon Public Key
const supabaseKey = 'sb_publishable_RcreZ0sWFSVsqVJswXrwtQ_gTDXdG0t';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: 'sb-food-ordering-token' // Menggunakan key unik agar tidak bentrok
  }
});