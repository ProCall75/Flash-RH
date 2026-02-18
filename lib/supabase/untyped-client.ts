import { createBrowserClient } from '@supabase/ssr';

/**
 * Untyped Supabase client for mutations (insert/update/delete).
 * The typed client resolves insert/update args to `never` because our
 * custom Database interface isn't compatible with supabase-js v2 codegen.
 * Use this for ALL write operations.
 */
export function createUntypedClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
