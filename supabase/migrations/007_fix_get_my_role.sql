-- Migration 007: Fix get_my_role() — lire depuis app_metadata
-- Le JWT Supabase stocke user_role dans app_metadata, pas à la racine
-- Donc auth.jwt() ->> 'user_role' retourne NULL
-- Correction: auth.jwt() -> 'app_metadata' ->> 'user_role'

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'user_role',
    (auth.jwt() -> 'app_metadata' ->> 'user_role')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
