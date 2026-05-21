import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ────────────────────────────────────────────────

export interface CotisationSettings {
  show_best_contributor: boolean;
  show_contributors: boolean;
  show_progress: boolean;
  show_target_amount: boolean;
  anonymous_allowed: boolean;
  min_amount: number;
  share_message?: string;
}

export interface Cotisation {
  id: string;
  slug: string;
  title: string;
  description?: string;
  cover_url?: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  owner_id: string;
  status: string;
  created_at: string;
  settings: CotisationSettings;
}

export interface Contribution {
  id: string;
  cotisation_id: string;
  contributor_name: string;
  contributor_phone: string;
  amount: number;
  status: string;
  paystack_reference?: string;
  created_at: string;
}
