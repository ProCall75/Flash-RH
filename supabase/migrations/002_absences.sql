-- Migration 002: Absences
-- Gestion des demandes d'absence

CREATE TABLE absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cp', 'cp_anticipation', 'sans_solde', 'maladie', 'accident_travail', 'exceptionnelle')),
  date_dernier_jour_travaille DATE NOT NULL,
  date_reprise DATE NOT NULL,
  choix_dates_2 JSONB DEFAULT NULL,
  choix_dates_3 JSONB DEFAULT NULL,
  commentaire TEXT,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'validee', 'refusee')),
  motif_refus TEXT,
  validee_par UUID REFERENCES profiles(id),
  date_validation TIMESTAMPTZ,
  derniere_minute BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT date_reprise_after_dernier_jour CHECK (date_reprise > date_dernier_jour_travaille),
  CONSTRAINT motif_refus_required CHECK (
    (statut != 'refusee') OR (motif_refus IS NOT NULL AND motif_refus != '')
  )
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER absences_updated_at
  BEFORE UPDATE ON absences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees see own absences" ON absences
  FOR SELECT USING (employe_id = auth.uid());

CREATE POLICY "Admins see all absences" ON absences
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );

CREATE POLICY "Employees create own absences" ON absences
  FOR INSERT WITH CHECK (employe_id = auth.uid());

CREATE POLICY "Admins validate absences" ON absences
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );

CREATE POLICY "Employees can update own pending absences" ON absences
  FOR UPDATE USING (
    employe_id = auth.uid() AND statut = 'en_attente'
  );
