-- Seed data pour Flash-RH
-- Catégories de frais selon grille papier Brice (réunion 10/02/2026)
-- 10 frais + 11 primes = 21 catégories

-- ── 10 FRAIS ──
INSERT INTO categories_frais (nom, montant_defaut, profil_vehicule, type, ordre_affichage) VALUES
  ('Repas midi RP', 10.00, 'tous', 'frais', 1),
  ('Repas soir RP', 10.00, 'tous', 'frais', 2),
  ('Repas midi province', 9.00, 'tous', 'frais', 3),
  ('Casse-croûte', 19.00, 'tous', 'frais', 4),
  ('Repas soir province', 16.00, 'tous', 'frais', 5),
  ('Nuit province VL', 16.00, 'VL', 'frais', 6),
  ('Nuit province PL', 65.00, 'PL', 'frais', 7),
  ('Repas soir étranger', 34.00, 'tous', 'frais', 8),
  ('Repas midi étranger', 19.00, 'tous', 'frais', 9),
  ('Hôtel', 19.00, 'tous', 'frais', 10);

-- ── 11 PRIMES ──
INSERT INTO categories_frais (nom, montant_defaut, profil_vehicule, type, ordre_affichage) VALUES
  ('Départ dimanche', 45.00, 'tous', 'prime', 20),
  ('½ samedi travaillé', 10.00, 'tous', 'prime', 21),
  ('½ dimanche travaillé', 50.00, 'tous', 'prime', 22),
  ('Samedi travaillé', 70.00, 'tous', 'prime', 23),
  ('Dimanche travaillé', 80.00, 'tous', 'prime', 24),
  ('1 week-end bloqué', 120.00, 'tous', 'prime', 25),
  ('1 dimanche bloqué', 80.00, 'tous', 'prime', 26),
  ('1 week-end travaillé', 170.00, 'tous', 'prime', 27),
  ('½ jour férié travaillé', 110.00, 'tous', 'prime', 28),
  ('Jour férié travaillé', 80.00, 'tous', 'prime', 29),
  ('Jour férié bloqué', 120.00, 'tous', 'prime', 30);

-- Période de frais (janvier-février 2026)
INSERT INTO periodes_frais (date_debut, date_fin, statut) VALUES
  ('2026-01-20', '2026-02-19', 'ouverte');
