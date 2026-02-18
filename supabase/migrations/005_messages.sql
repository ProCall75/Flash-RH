-- Migration 005: Messages et Notifications
-- Messagerie interne (remplacement WhatsApp) + notifications

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auteur_id UUID NOT NULL REFERENCES profiles(id),
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('note_service', 'info', 'rappel', 'urgent')),
  destinataires TEXT NOT NULL DEFAULT 'tous' CHECK (destinataires IN ('tous', 'conducteurs_pl', 'conducteurs_vl', 'bureau')),
  piece_jointe_url TEXT,
  lu_par UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destinataire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  lue BOOLEAN NOT NULL DEFAULT false,
  lien TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lue_at TIMESTAMPTZ
);

-- Index pour performance
CREATE INDEX idx_notifications_destinataire ON notifications(destinataire_id, lue);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_absences_employe ON absences(employe_id, statut);
CREATE INDEX idx_releves_employe ON releves_frais(employe_id, periode_id);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Messages: tout le monde peut lire (filtrage par destinataires côté app)
CREATE POLICY "Users read messages" ON messages
  FOR SELECT USING (true);
CREATE POLICY "Admins create messages" ON messages
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );
CREATE POLICY "Admins update messages" ON messages
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );

-- Notifications: chaque user voit les siennes
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (destinataire_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (destinataire_id = auth.uid());
CREATE POLICY "System creates notifications" ON notifications
  FOR INSERT WITH CHECK (true);
