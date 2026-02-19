-- Migration 010: Fix messages FK to cascade on profile delete
-- Prevents FK violation when resetting auth users

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_auteur_id_fkey;
ALTER TABLE messages
  ADD CONSTRAINT messages_auteur_id_fkey
  FOREIGN KEY (auteur_id) REFERENCES profiles(id) ON DELETE CASCADE;
