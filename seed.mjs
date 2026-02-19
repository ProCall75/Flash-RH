#!/usr/bin/env node
/**
 * Flash RH — Seed Script
 * Creates test users via Supabase Auth API, then seeds all data tables.
 * 
 * Usage: node seed.mjs
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jargxxcivmctajtngscq.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required.');
    console.error('   Find it in: Supabase Dashboard → Settings → API → service_role key');
    console.error('   Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node seed.mjs');
    process.exit(1);
}

const headers = {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
};

async function supabaseAdmin(path, method = 'GET', body = null) {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    if (!res.ok && res.status !== 409) {
        console.error(`❌ ${method} ${path} → ${res.status}`, data);
        return null;
    }
    return data;
}

async function rpc(sql) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: sql }),
    });
    // rpc might not exist, fallback to direct query
    if (!res.ok) {
        // Use the SQL endpoint instead
        const res2 = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'GET',
            headers: { ...headers, 'Prefer': 'return=representation' },
        });
        return null;
    }
    return await res.json();
}

async function restInsert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
            ...headers,
            'Prefer': 'return=representation,resolution=merge-duplicates',
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
        console.error(`  ❌ INSERT ${table}:`, result.message || result);
        return null;
    }
    return result;
}

async function restSelect(table, query = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
        method: 'GET',
        headers: { ...headers, 'Prefer': 'return=representation' },
    });
    return await res.json();
}

// ─────────────────────────────────────────────
// STEP 1: Create Auth Users
// ─────────────────────────────────────────────

const TEST_USERS = [
    {
        email: 'admin@flash-rh.test',
        password: 'Flash2026!admin',
        meta: { nom: 'Dupont', prenom: 'Pierre', role: 'admin' },
    },
    {
        email: 'bureau@flash-rh.test',
        password: 'Flash2026!bureau',
        meta: { nom: 'Martin', prenom: 'Sophie', role: 'bureau' },
    },
    {
        email: 'conducteur@flash-rh.test',
        password: 'Flash2026!cond',
        meta: { nom: 'Durand', prenom: 'Jean', role: 'conducteur' },
    },
    {
        email: 'conducteur2@flash-rh.test',
        password: 'Flash2026!cond',
        meta: { nom: 'Leroy', prenom: 'Marc', role: 'conducteur' },
    },
];

async function main() {
    console.log('🚀 Flash RH — Seed Script');
    console.log('========================\n');

    // ── Auth Users ──
    console.log('📌 STEP 1: Creating auth users...');
    const userIds = {};

    for (const u of TEST_USERS) {
        // Check if user already exists by listing users
        const existing = await supabaseAdmin(
            `/auth/v1/admin/users?page=1&per_page=50`,
            'GET'
        );

        const found = existing?.users?.find(eu => eu.email === u.email);

        if (found) {
            console.log(`  ✔ ${u.email} already exists (${found.id})`);
            userIds[u.email] = found.id;

            // Update profile to ensure role + vehicule are correct
            await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${found.id}`, {
                method: 'PATCH',
                headers: { ...headers, 'Prefer': 'return=representation' },
                body: JSON.stringify({
                    role: u.meta.role,
                    profil_vehicule: u.email.includes('conducteur1') ? 'PL' : u.email.includes('conducteur2') ? 'VL' : null,
                }),
            });
            continue;
        }

        const created = await supabaseAdmin('/auth/v1/admin/users', 'POST', {
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: u.meta,
        });

        if (created?.id) {
            console.log(`  ✔ Created ${u.email} → ${created.id}`);
            userIds[u.email] = created.id;
        } else {
            console.error(`  ❌ Failed to create ${u.email}`);
        }
    }

    // Wait for triggers to fire (profile creation)
    console.log('  ⏳ Waiting for profile triggers...');
    await new Promise(r => setTimeout(r, 2000));

    // Update vehicle profiles for conducteurs
    for (const email of Object.keys(userIds)) {
        if (email === 'conducteur@flash-rh.test') {
            await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userIds[email]}`, {
                method: 'PATCH',
                headers: { ...headers, 'Prefer': 'return=representation' },
                body: JSON.stringify({ profil_vehicule: 'PL' }),
            });
            console.log(`  ✔ Set ${email} → PL`);
        }
        if (email === 'conducteur2@flash-rh.test') {
            await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userIds[email]}`, {
                method: 'PATCH',
                headers: { ...headers, 'Prefer': 'return=representation' },
                body: JSON.stringify({ profil_vehicule: 'VL' }),
            });
            console.log(`  ✔ Set ${email} → VL`);
        }
    }

    // Verify profiles exist
    const profiles = await restSelect('profiles', 'select=id,email,role,profil_vehicule,actif');
    console.log(`  📊 Profiles in DB: ${profiles?.length || 0}`);
    if (Array.isArray(profiles)) {
        profiles.forEach(p => console.log(`     - ${p.email} | ${p.role} | ${p.profil_vehicule || 'aucun'} | ${p.actif ? '✓ actif' : '✗ inactif'}`));
    }

    // ── Sync roles to JWT (re-trigger for safety) ──
    console.log('\n📌 STEP 1b: Syncing roles to JWT claims...');
    if (Array.isArray(profiles)) {
        for (const p of profiles) {
            await supabaseAdmin(`/auth/v1/admin/users/${p.id}`, 'PUT', {
                app_metadata: { user_role: p.role },
            });
            console.log(`  ✔ JWT synced: ${p.email} → ${p.role}`);
        }
    }

    // ── Catégories ──
    console.log('\n📌 STEP 2: Seeding categories...');
    const existingCats = await restSelect('categories_frais', 'select=id,nom');
    if (existingCats?.length > 0) {
        console.log(`  ✔ ${existingCats.length} catégories déjà présentes`);
    } else {
        const categories = [
            // ── 10 FRAIS (source: grille papier Brice, réunion 10/02/2026) ──
            { nom: 'Repas midi RP', montant_defaut: 10.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 1, actif: true },
            { nom: 'Repas soir RP', montant_defaut: 10.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 2, actif: true },
            { nom: 'Repas midi province', montant_defaut: 9.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 3, actif: true },
            { nom: 'Casse-croûte', montant_defaut: 19.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 4, actif: true },
            { nom: 'Repas soir province', montant_defaut: 16.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 5, actif: true },
            { nom: 'Nuit province VL', montant_defaut: 16.00, profil_vehicule: 'VL', type: 'frais', ordre_affichage: 6, actif: true },
            { nom: 'Nuit province PL', montant_defaut: 65.00, profil_vehicule: 'PL', type: 'frais', ordre_affichage: 7, actif: true },
            { nom: 'Repas soir étranger', montant_defaut: 34.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 8, actif: true },
            { nom: 'Repas midi étranger', montant_defaut: 19.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 9, actif: true },
            { nom: 'Hôtel', montant_defaut: 19.00, profil_vehicule: 'tous', type: 'frais', ordre_affichage: 10, actif: true },
            // ── 11 PRIMES (source: grille papier Brice, réunion 10/02/2026) ──
            { nom: 'Départ dimanche', montant_defaut: 45.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 20, actif: true },
            { nom: '½ samedi travaillé', montant_defaut: 10.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 21, actif: true },
            { nom: '½ dimanche travaillé', montant_defaut: 50.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 22, actif: true },
            { nom: 'Samedi travaillé', montant_defaut: 70.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 23, actif: true },
            { nom: 'Dimanche travaillé', montant_defaut: 80.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 24, actif: true },
            { nom: '1 week-end bloqué', montant_defaut: 120.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 25, actif: true },
            { nom: '1 dimanche bloqué', montant_defaut: 80.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 26, actif: true },
            { nom: '1 week-end travaillé', montant_defaut: 170.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 27, actif: true },
            { nom: '½ jour férié travaillé', montant_defaut: 110.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 28, actif: true },
            { nom: 'Jour férié travaillé', montant_defaut: 80.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 29, actif: true },
            { nom: 'Jour férié bloqué', montant_defaut: 120.00, profil_vehicule: 'tous', type: 'prime', ordre_affichage: 30, actif: true },
        ];
        const catResult = await restInsert('categories_frais', categories);
        console.log(`  ✔ ${catResult?.length || 0} catégories créées`);
    }

    // ── Périodes ──
    console.log('\n📌 STEP 3: Seeding périodes...');
    const existingPeriodes = await restSelect('periodes_frais', 'select=id,date_debut,date_fin,statut');
    if (existingPeriodes?.length > 0) {
        console.log(`  ✔ ${existingPeriodes.length} périodes déjà présentes`);
    } else {
        const periodes = [
            { date_debut: '2026-01-20', date_fin: '2026-02-20', statut: 'ouverte' },
            { date_debut: '2025-12-20', date_fin: '2026-01-20', statut: 'cloturee' },
        ];
        const perResult = await restInsert('periodes_frais', periodes);
        console.log(`  ✔ ${perResult?.length || 0} périodes créées (1 ouverte + 1 clôturée)`);
    }

    // ── Absences ──
    console.log('\n📌 STEP 4: Seeding absences...');
    const cond1Id = userIds['conducteur@flash-rh.test'];
    const cond2Id = userIds['conducteur2@flash-rh.test'];

    if (cond1Id) {
        const existingAbs = await restSelect('absences', `select=id&employe_id=eq.${cond1Id}`);
        if (existingAbs?.length > 0) {
            console.log(`  ✔ Absences déjà présentes pour conducteur1`);
        } else {
            const absences = [
                {
                    employe_id: cond1Id,
                    type: 'cp',
                    date_dernier_jour_travaille: '2026-03-10',
                    date_reprise: '2026-03-17',
                    statut: 'en_attente',
                    derniere_minute: false,
                },
                {
                    employe_id: cond1Id,
                    type: 'maladie',
                    date_dernier_jour_travaille: '2026-02-01',
                    date_reprise: '2026-02-05',
                    statut: 'validee',
                    derniere_minute: false,
                    validee_par: userIds['admin@flash-rh.test'] || null,
                },
            ];
            if (cond2Id) {
                absences.push({
                    employe_id: cond2Id,
                    type: 'sans_solde',
                    date_dernier_jour_travaille: '2026-04-01',
                    date_reprise: '2026-04-03',
                    statut: 'en_attente',
                    derniere_minute: true,
                });
            }
            const absResult = await restInsert('absences', absences);
            console.log(`  ✔ ${absResult?.length || 0} absences créées`);
        }
    }

    // ── Relevés de frais ──
    console.log('\n📌 STEP 5: Seeding relevés de frais...');
    const allPeriodes = await restSelect('periodes_frais', 'select=id,statut&order=date_debut.desc');
    const openPeriode = allPeriodes?.find(p => p.statut === 'ouverte');
    const closedPeriode = allPeriodes?.find(p => p.statut === 'cloturee');

    if (openPeriode && cond1Id) {
        const existingReleves = await restSelect('releves_frais', `select=id&employe_id=eq.${cond1Id}&periode_id=eq.${openPeriode.id}`);
        if (existingReleves?.length > 0) {
            console.log(`  ✔ Relevés déjà présents`);
        } else {
            // Conducteur 1: soumis (for admin to validate)
            const releve1 = await restInsert('releves_frais', {
                employe_id: cond1Id,
                periode_id: openPeriode.id,
                statut: 'soumis',
                total_frais: 129.60,
                total_primes: 50.00,
                total_general: 179.60,
            });

            if (releve1?.[0]?.id) {
                const cats = await restSelect('categories_frais', 'select=id,nom,montant_defaut,type');
                const repas = cats?.find(c => c.nom === 'Repas midi');
                const prime = cats?.find(c => c.nom === 'Prime qualité PL');

                if (repas) {
                    // 8 days of lunch
                    for (let d = 20; d <= 27; d++) {
                        await restInsert('lignes_frais', {
                            releve_id: releve1[0].id,
                            date_jour: `2026-01-${d}`,
                            categorie_id: repas.id,
                            montant: repas.montant_defaut,
                            coche: true,
                            corrige_par_admin: false,
                        });
                    }
                    console.log(`  ✔ 8 lignes frais créées pour conducteur1`);
                }

                if (prime) {
                    await restInsert('lignes_primes', {
                        releve_id: releve1[0].id,
                        date_jour: '2026-01-31',
                        categorie_id: prime.id,
                        montant: prime.montant_defaut,
                        quantite: 1,
                        corrige_par_admin: false,
                    });
                    console.log(`  ✔ 1 ligne prime créée pour conducteur1`);
                }
            }

            // Conducteur 2: brouillon
            if (cond2Id) {
                await restInsert('releves_frais', {
                    employe_id: cond2Id,
                    periode_id: openPeriode.id,
                    statut: 'brouillon',
                    total_frais: 0,
                    total_primes: 0,
                    total_general: 0,
                });
                console.log(`  ✔ Relevé brouillon créé pour conducteur2`);
            }
        }
    }

    // ── Messages ──
    console.log('\n📌 STEP 6: Seeding messages...');
    const adminId = userIds['admin@flash-rh.test'];
    if (adminId) {
        const existingMsgs = await restSelect('messages', `select=id&auteur_id=eq.${adminId}`);
        if (existingMsgs?.length > 0) {
            console.log(`  ✔ Messages déjà présents`);
        } else {
            const messages = [
                {
                    auteur_id: adminId,
                    titre: 'Rappel: Contrôle technique obligatoire',
                    contenu: 'Tous les conducteurs PL doivent faire vérifier leur véhicule avant le 28 février. Veuillez prendre rendez-vous dès que possible.',
                    type: 'rappel',
                    destinataires: 'conducteurs_pl',
                    lu_par: [],
                },
                {
                    auteur_id: adminId,
                    titre: 'Nouvelle procédure de frais',
                    contenu: 'À partir du mois prochain, les justificatifs photo seront obligatoires pour les frais de repas supérieurs à 20€. Merci de votre compréhension.',
                    type: 'note_service',
                    destinataires: 'tous',
                    lu_par: [],
                },
                {
                    auteur_id: adminId,
                    titre: '🎉 Bonne année 2026 !',
                    contenu: 'Toute l\'équipe Flash Transports vous souhaite une excellente année 2026. Merci pour votre travail et votre engagement quotidien.',
                    type: 'info',
                    destinataires: 'tous',
                    lu_par: [],
                },
            ];
            const msgResult = await restInsert('messages', messages);
            console.log(`  ✔ ${msgResult?.length || 0} messages créés`);
        }
    }

    // ── Notifications ──
    console.log('\n📌 STEP 7: Seeding notifications...');
    if (cond1Id) {
        const existingNotifs = await restSelect('notifications', `select=id&destinataire_id=eq.${cond1Id}`);
        if (existingNotifs?.length > 0) {
            console.log(`  ✔ Notifications déjà présentes`);
        } else {
            const notifications = [
                {
                    destinataire_id: cond1Id,
                    type: 'absence_validee',
                    titre: 'Absence validée',
                    contenu: 'Votre demande de congé maladie du 01/02 au 05/02 a été approuvée.',
                    lue: false,
                    lien: '/absences',
                },
                {
                    destinataire_id: cond1Id,
                    type: 'frais_soumis',
                    titre: 'Relevé soumis',
                    contenu: 'Votre relevé de frais de janvier a bien été soumis. Il sera examiné sous 48h.',
                    lue: true,
                    lien: '/frais',
                    lue_at: new Date().toISOString(),
                },
                {
                    destinataire_id: cond1Id,
                    type: 'message',
                    titre: 'Nouveau message',
                    contenu: 'Pierre Dupont a publié un rappel concernant le contrôle technique.',
                    lue: false,
                    lien: '/messages',
                },
            ];

            if (adminId) {
                notifications.push({
                    destinataire_id: adminId,
                    type: 'frais_a_valider',
                    titre: 'Relevé à valider',
                    contenu: 'Jean Durand a soumis son relevé de frais de janvier (179,60 €).',
                    lue: false,
                    lien: '/frais',
                });
                notifications.push({
                    destinataire_id: adminId,
                    type: 'absence_demande',
                    titre: 'Nouvelle demande d\'absence',
                    contenu: 'Jean Durand demande un CP du 10/03 au 17/03.',
                    lue: false,
                    lien: '/absences',
                });
            }

            const notResult = await restInsert('notifications', notifications);
            console.log(`  ✔ ${notResult?.length || 0} notifications créées`);
        }
    }

    // ── Final Summary ──
    console.log('\n══════════════════════════════════');
    console.log('✅ SEED COMPLETE');
    console.log('══════════════════════════════════');
    console.log('\n🔑 Test Accounts:');
    console.log('  Admin:       admin@flash-rh.test / Flash2026!admin');
    console.log('  Bureau:      bureau@flash-rh.test / Flash2026!bureau');
    console.log('  Conducteur:  conducteur@flash-rh.test / Flash2026!cond  (PL)');
    console.log('  Conducteur:  conducteur2@flash-rh.test / Flash2026!cond  (VL)');
    console.log('\n✅ Data seeded:');
    console.log('  - 4 users (admin, bureau, 2 conducteurs)');
    console.log('  - 21 catégories frais/primes (10 frais + 11 primes)');
    console.log('  - 2 périodes (1 ouverte, 1 clôturée)');
    console.log('  - 3 absences (2 cond1, 1 cond2)');
    console.log('  - 2 relevés frais (1 soumis, 1 brouillon)');
    console.log('  - 3 messages');
    console.log('  - 5 notifications');
}

main().catch(console.error);
