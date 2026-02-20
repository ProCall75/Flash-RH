import { createClient } from '@supabase/supabase-js';

/**
 * Server-side admin client using service_role key.
 * Bypasses RLS - use ONLY for operations that need elevated privileges
 * like status transitions (brouillon→soumis, soumis→valide).
 * 
 * NEVER expose this on the client side.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
