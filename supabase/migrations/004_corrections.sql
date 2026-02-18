-- Migration 004: Corrections et Contestations
-- Traçabilité des modifications admin sur les relevés de frais

CREATE TABLE corrections_frais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  releve_id UUID NOT NULL REFERENCES releves_frais(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id),
  champ_modifie TEXT NOT NULL,
  ancienne_valeur TEXT NOT NULL,
  nouvelle_valeur TEXT NOT NULL,
  date_correction TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE contestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  releve_id UUID NOT NULL REFERENCES releves_frais(id) ON DELETE CASCADE,
  employe_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'ouverte' CHECK (statut IN ('ouverte', 'resolue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolue_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE corrections_frais ENABLE ROW LEVEL SECURITY;
ALTER TABLE contestations ENABLE ROW LEVEL SECURITY;

-- Corrections: admin crée, tout le monde lit (traçabilité)
CREATE POLICY "All users read corrections" ON corrections_frais
  FOR SELECT USING (true);
CREATE POLICY "Admins create corrections" ON corrections_frais
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );

-- Contestations: conducteur crée les siennes, admin voit tout
CREATE POLICY "Employees see own contestations" ON contestations
  FOR SELECT USING (employe_id = auth.uid());
CREATE POLICY "Admins see all contestations" ON contestations
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );
CREATE POLICY "Employees create own contestations" ON contestations
  FOR INSERT WITH CHECK (employe_id = auth.uid());
CREATE POLICY "Admins update contestations" ON contestations
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );
