-- Migration 006: Fix RLS — Élimination de la récursion infinie
-- Problème: toutes les policies admin/bureau font SELECT role FROM profiles
-- à l'intérieur de policies sur profiles → boucle infinie.
-- Solution: utiliser auth.jwt() ->> 'user_role' (claim stocké dans le JWT)

-- ═══════════════════════════════════════════════
-- ÉTAPE 1: Fonction pour synchroniser le rôle dans le JWT
-- ═══════════════════════════════════════════════

-- Cette fonction copie le role dans raw_app_meta_data
-- afin que auth.jwt() le contienne automatiquement
CREATE OR REPLACE FUNCTION sync_role_to_jwt()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('user_role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: sync à chaque INSERT ou UPDATE du role
DROP TRIGGER IF EXISTS on_profile_role_sync ON profiles;
CREATE TRIGGER on_profile_role_sync
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_role_to_jwt();

-- Sync initiale: mettre à jour tous les users existants
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN SELECT id, role FROM profiles LOOP
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('user_role', p.role)
    WHERE id = p.id;
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════
-- ÉTAPE 2: Helper function pour éviter la répétition
-- ═══════════════════════════════════════════════

-- Fonction utilitaire: retourne le role depuis le JWT (pas de query sur profiles)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::jsonb ->> 'user_role',
    (auth.jwt() ->> 'user_role')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ═══════════════════════════════════════════════
-- ÉTAPE 3: Recréer les policies — 001_profiles
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    get_my_role() = 'admin'
  );

-- ═══════════════════════════════════════════════
-- ÉTAPE 4: Recréer les policies — 002_absences
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS "Admins see all absences" ON absences;
CREATE POLICY "Admins see all absences" ON absences
  FOR SELECT USING (
    get_my_role() IN ('admin', 'bureau')
  );

DROP POLICY IF EXISTS "Admins validate absences" ON absences;
CREATE POLICY "Admins validate absences" ON absences
  FOR UPDATE USING (
    get_my_role() IN ('admin', 'bureau')
  );

-- ═══════════════════════════════════════════════
-- ÉTAPE 5: Recréer les policies — 003_frais
-- ═══════════════════════════════════════════════

-- periodes_frais
DROP POLICY IF EXISTS "Admins manage periodes" ON periodes_frais;
CREATE POLICY "Admins manage periodes" ON periodes_frais
  FOR ALL USING (
    get_my_role() = 'admin'
  );

-- categories_frais
DROP POLICY IF EXISTS "Admins manage categories" ON categories_frais;
CREATE POLICY "Admins manage categories" ON categories_frais
  FOR ALL USING (
    get_my_role() = 'admin'
  );

-- releves_frais
DROP POLICY IF EXISTS "Admins see all releves" ON releves_frais;
CREATE POLICY "Admins see all releves" ON releves_frais
  FOR SELECT USING (
    get_my_role() IN ('admin', 'bureau')
  );

DROP POLICY IF EXISTS "Admins update all releves" ON releves_frais;
CREATE POLICY "Admins update all releves" ON releves_frais
  FOR UPDATE USING (
    get_my_role() IN ('admin', 'bureau')
  );

-- lignes_frais
DROP POLICY IF EXISTS "Admins manage all lignes_frais" ON lignes_frais;
CREATE POLICY "Admins manage all lignes_frais" ON lignes_frais
  FOR ALL USING (
    get_my_role() IN ('admin', 'bureau')
  );

-- lignes_primes
DROP POLICY IF EXISTS "Admins manage all lignes_primes" ON lignes_primes;
CREATE POLICY "Admins manage all lignes_primes" ON lignes_primes
  FOR ALL USING (
    get_my_role() IN ('admin', 'bureau')
  );

-- ═══════════════════════════════════════════════
-- ÉTAPE 6: Recréer les policies — 004_corrections
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS "Admins create corrections" ON corrections_frais;
CREATE POLICY "Admins create corrections" ON corrections_frais
  FOR INSERT WITH CHECK (
    get_my_role() IN ('admin', 'bureau')
  );

DROP POLICY IF EXISTS "Admins see all contestations" ON contestations;
CREATE POLICY "Admins see all contestations" ON contestations
  FOR SELECT USING (
    get_my_role() IN ('admin', 'bureau')
  );

DROP POLICY IF EXISTS "Admins update contestations" ON contestations;
CREATE POLICY "Admins update contestations" ON contestations
  FOR UPDATE USING (
    get_my_role() IN ('admin', 'bureau')
  );

-- ═══════════════════════════════════════════════
-- ÉTAPE 7: Recréer les policies — 005_messages
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS "Admins create messages" ON messages;
CREATE POLICY "Admins create messages" ON messages
  FOR INSERT WITH CHECK (
    get_my_role() IN ('admin', 'bureau')
  );

DROP POLICY IF EXISTS "Admins update messages" ON messages;
CREATE POLICY "Admins update messages" ON messages
  FOR UPDATE USING (
    get_my_role() IN ('admin', 'bureau')
  );
