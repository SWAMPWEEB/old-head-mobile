import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase client configuration
 *
 * The URL and anonymous key are pulled from the Expo configuration (extra
 * values) if available.  If those are not set the code falls back to
 * environment variables.  This makes it possible to run the app in Expo
 * Go without a separate .env file.
 */
const extra =
  (Constants?.expoConfig && Constants.expoConfig.extra) ||
  (Constants?.manifest && Constants.manifest.extra) ||
  {};

const SUPABASE_URL =
  extra.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
  extra.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);