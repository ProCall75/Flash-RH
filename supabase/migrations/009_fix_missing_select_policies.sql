-- Migration 009: Fix missing SELECT policies
-- Bug: 006_fix_rls.sql only recreated INSERT/UPDATE policies for messages
-- but dropped the original "Users read messages" SELECT policy.
-- Also re-ensure SELECT policies exist for profiles, periodes, categories.

-- ═══════════════════════════════════════════════
-- MESSAGES: everyone can read (filtering done app-side)
-- ═══════════════════════════════════════════════
DROP POLICY IF EXISTS "Users read messages" ON messages;
CREATE POLICY "Users read messages" ON messages
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════
-- PROFILES: everyone can view all profiles
-- ═══════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════
-- PERIODES_FRAIS: everyone can read periodes
-- ═══════════════════════════════════════════════
DROP POLICY IF EXISTS "All users read periodes" ON periodes_frais;
CREATE POLICY "All users read periodes" ON periodes_frais
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════
-- CATEGORIES_FRAIS: everyone can read categories
-- ═══════════════════════════════════════════════
DROP POLICY IF EXISTS "All users read categories" ON categories_frais;
CREATE POLICY "All users read categories" ON categories_frais
  FOR SELECT USING (true);
