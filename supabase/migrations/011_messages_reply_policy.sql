-- Migration 011: Allow all authenticated users to create messages (reply feature)
-- Previously only admin/bureau could INSERT messages.
-- Now any authenticated user can reply to messages.

DROP POLICY IF EXISTS "Admins create messages" ON messages;

CREATE POLICY "Authenticated users create messages" ON messages
  FOR INSERT WITH CHECK (auteur_id = auth.uid());
