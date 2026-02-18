-- Migration 003: Frais
-- Gestion des notes de frais (cycle 20-20)

-- Périodes de frais (du 20 au 20 de chaque mois)
CREATE TABLE periodes_frais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'ouverte' CHECK (statut IN ('ouverte', 'cloturee')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT periode_dates_valid CHECK (date_fin > date_debut),
  CONSTRAINT unique_periode UNIQUE (date_debut, date_fin)
);

-- Catégories de frais et primes (configurables par admin)
CREATE TABLE categories_frais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  montant_defaut NUMERIC(10,2) NOT NULL DEFAULT 0,
  profil_vehicule TEXT NOT NULL DEFAULT 'tous' CHECK (profil_vehicule IN ('VL', 'PL', 'tous')),
  type TEXT NOT NULL DEFAULT 'frais' CHECK (type IN ('frais', 'prime')),
  ordre_affichage INTEGER NOT NULL DEFAULT 0,
  actif BOOLEAN NOT NULL DEFAULT true
);

-- Relevés de frais (un par conducteur par période)
CREATE TABLE releves_frais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employe_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  periode_id UUID NOT NULL REFERENCES periodes_frais(id) ON DELETE RESTRICT,
  statut TEXT NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'soumis', 'valide', 'corrige', 'conteste')),
  total_frais NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_primes NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_general NUMERIC(10,2) NOT NULL DEFAULT 0,
  validee_par UUID REFERENCES profiles(id),
  date_validation TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_releve_per_period UNIQUE (employe_id, periode_id)
);

CREATE TRIGGER releves_frais_updated_at
  BEFORE UPDATE ON releves_frais
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Lignes de frais (une par jour par catégorie)
CREATE TABLE lignes_frais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  releve_id UUID NOT NULL REFERENCES releves_frais(id) ON DELETE CASCADE,
  date_jour DATE NOT NULL,
  categorie_id UUID NOT NULL REFERENCES categories_frais(id),
  montant NUMERIC(10,2) NOT NULL DEFAULT 0,
  coche BOOLEAN NOT NULL DEFAULT false,
  corrige_par_admin BOOLEAN NOT NULL DEFAULT false
);

-- Lignes de primes (quantité × montant)
CREATE TABLE lignes_primes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  releve_id UUID NOT NULL REFERENCES releves_frais(id) ON DELETE CASCADE,
  date_jour DATE NOT NULL,
  categorie_id UUID NOT NULL REFERENCES categories_frais(id),
  montant NUMERIC(10,2) NOT NULL DEFAULT 0,
  quantite INTEGER NOT NULL DEFAULT 1,
  corrige_par_admin BOOLEAN NOT NULL DEFAULT false
);

-- RLS
ALTER TABLE periodes_frais ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories_frais ENABLE ROW LEVEL SECURITY;
ALTER TABLE releves_frais ENABLE ROW LEVEL SECURITY;
ALTER TABLE lignes_frais ENABLE ROW LEVEL SECURITY;
ALTER TABLE lignes_primes ENABLE ROW LEVEL SECURITY;

-- Périodes: tout le monde lit, admin écrit
CREATE POLICY "All users read periodes" ON periodes_frais FOR SELECT USING (true);
CREATE POLICY "Admins manage periodes" ON periodes_frais FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Catégories: tout le monde lit, admin écrit
CREATE POLICY "All users read categories" ON categories_frais FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON categories_frais FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Relevés: conducteur voit les siens, admin voit tout
CREATE POLICY "Employees see own releves" ON releves_frais
  FOR SELECT USING (employe_id = auth.uid());
CREATE POLICY "Admins see all releves" ON releves_frais
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );
CREATE POLICY "Employees create own releves" ON releves_frais
  FOR INSERT WITH CHECK (employe_id = auth.uid());
CREATE POLICY "Employees update own draft releves" ON releves_frais
  FOR UPDATE USING (employe_id = auth.uid() AND statut IN ('brouillon', 'conteste'));
CREATE POLICY "Admins update all releves" ON releves_frais
  FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );

-- Lignes frais: via relevé
CREATE POLICY "Users manage own lignes_frais" ON lignes_frais
  FOR ALL USING (
    releve_id IN (SELECT id FROM releves_frais WHERE employe_id = auth.uid())
  );
CREATE POLICY "Admins manage all lignes_frais" ON lignes_frais
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );

-- Lignes primes: via relevé
CREATE POLICY "Users manage own lignes_primes" ON lignes_primes
  FOR ALL USING (
    releve_id IN (SELECT id FROM releves_frais WHERE employe_id = auth.uid())
  );
CREATE POLICY "Admins manage all lignes_primes" ON lignes_primes
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'bureau')
  );
