-- Migration 012: Allow all authenticated users to update messages (lu_par field)
-- Bug: Only admins had UPDATE policy on messages, so conducteurs couldn't
-- mark messages as read (markAsRead function updates lu_par).

DROP POLICY IF EXISTS "Users update lu_par" ON messages;
CREATE POLICY "Users update lu_par" ON messages
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
