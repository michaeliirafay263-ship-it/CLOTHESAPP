import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Validates that the necessary Supabase environment variables are defined.
 * Throws a clear descriptive error if any required variable is missing.
 */
function getValidatedConfig(): { url: string; key: string } {
  const missing: string[] = [];

  if (!supabaseUrl || supabaseUrl.trim() === '') {
    missing.push('VITE_SUPABASE_URL');
  }

  if (!supabasePublishableKey || supabasePublishableKey.trim() === '') {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `[Supabase Config Error] Missing required environment variable(s): ${missing.join(
        ', '
      )}. Please provide these variables in your .env or .env.local file.`
    );
  }

  return { url: supabaseUrl as string, key: supabasePublishableKey as string };
}

/**
 * Factory function to create Supabase clients without placeholder fallbacks.
 */
function createSupabaseInstance(options?: { storageKey?: string }): SupabaseClient | null {
  try {
    const { url, key } = getValidatedConfig();
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        ...(options?.storageKey ? { storageKey: options.storageKey } : {}),
      },
    });
  } catch (error) {
    return null;
  }
}

/**
 * Customer & Rider Supabase Client.
 * Strict initialization without placeholder URL/key fallbacks.
 */
export const supabase: SupabaseClient | null = createSupabaseInstance();

/**
 * Admin Panel Supabase Client.
 * Strict initialization without placeholder URL/key fallbacks.
 */
export const adminSupabase: SupabaseClient | null = createSupabaseInstance({
  storageKey: 'darstore_admin_supabase_auth',
});

/**
 * Performs a safe connection check against the configured Supabase project.
 * Does not create tables, query application tables, or insert fake data.
 */
export async function testSupabaseClientConnection(
  clientType: 'customer-rider' | 'admin' = 'customer-rider'
): Promise<{
  clientType: string;
  isUrlConfigured: boolean;
  isKeyConfigured: boolean;
  canConnect: boolean;
  error?: string;
}> {
  const isUrlConfigured = Boolean(supabaseUrl && supabaseUrl.trim().length > 0);
  const isKeyConfigured = Boolean(
    supabasePublishableKey && supabasePublishableKey.trim().length > 0
  );

  if (!isUrlConfigured || !isKeyConfigured) {
    const missing: string[] = [];
    if (!isUrlConfigured) missing.push('VITE_SUPABASE_URL');
    if (!isKeyConfigured) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');

    return {
      clientType,
      isUrlConfigured,
      isKeyConfigured,
      canConnect: false,
      error: `Missing environment variable(s): ${missing.join(', ')}`,
    };
  }

  try {
    const client = clientType === 'admin' ? adminSupabase : supabase;
    if (!client) {
      throw new Error('Supabase client failed to initialize due to invalid configuration.');
    }

    // Safe health/connection check using Supabase Auth service ping
    const { error } = await client.auth.getSession();
    if (error) {
      return {
        clientType,
        isUrlConfigured: true,
        isKeyConfigured: true,
        canConnect: false,
        error: error.message,
      };
    }

    return {
      clientType,
      isUrlConfigured: true,
      isKeyConfigured: true,
      canConnect: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      clientType,
      isUrlConfigured: true,
      isKeyConfigured: true,
      canConnect: false,
      error: message,
    };
  }
}

export default supabase;
