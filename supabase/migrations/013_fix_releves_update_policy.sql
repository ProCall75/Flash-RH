-- Migration 013: Fix releves_frais UPDATE policy
-- Bug: The policy "Employees update own draft releves" blocks status transitions
-- because PostgreSQL RLS checks the WITH CHECK clause against the NEW row.
-- When status changes from 'brouillon' -> 'soumis', the new row has 
-- statut='soumis' which is NOT in ('brouillon','conteste'), so the update fails.
--
-- Fix: Add WITH CHECK that allows any valid status transition.

DROP POLICY IF EXISTS "Employees update own draft releves" ON releves_frais;
CREATE POLICY "Employees update own draft releves" ON releves_frais
  FOR UPDATE 
  USING (employe_id = auth.uid() AND statut IN ('brouillon', 'conteste'))
  WITH CHECK (employe_id = auth.uid() AND statut IN ('brouillon', 'soumis', 'conteste'));
