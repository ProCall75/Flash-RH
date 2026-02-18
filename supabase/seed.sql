-- Seed data pour Flash-RH
-- Catégories de frais selon conventions collectives transport
-- Source: Réunion du 22 janvier 2026

-- Frais repas
INSERT INTO categories_frais (nom, montant_defaut, profil_vehicule, type, ordre_affichage) VALUES
  ('Repas midi (restaurant)', 10.00, 'tous', 'frais', 1),
  ('Repas soir (restaurant)', 10.00, 'tous', 'frais', 2),
  ('Petit-déjeuner', 5.00, 'tous', 'frais', 3);

-- Frais nuit
INSERT INTO categories_frais (nom, montant_defaut, profil_vehicule, type, ordre_affichage) VALUES
  ('Nuit province (PL)', 65.00, 'PL', 'frais', 10),
  ('Nuit province (VL)', 16.00, 'VL', 'frais', 11),
  ('Nuit région parisienne', 80.00, 'tous', 'frais', 12);

-- Primes
INSERT INTO categories_frais (nom, montant_defaut, profil_vehicule, type, ordre_affichage) VALUES
  ('Prime casse-croûte', 5.00, 'PL', 'prime', 20),
  ('Prime salissure', 3.00, 'PL', 'prime', 21),
  ('Prime entretien véhicule', 7.50, 'PL', 'prime', 22),
  ('Prime polyvalence', 10.00, 'tous', 'prime', 23);

-- Période de frais exemple (janvier-février 2026)
INSERT INTO periodes_frais (date_debut, date_fin, statut) VALUES
  ('2026-01-20', '2026-02-19', 'ouverte');
