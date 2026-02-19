const BASE = 'https://jargxxcivmctajtngscq.supabase.co';
const SRK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphcmd4eGNpdm1jdGFqdG5nc2NxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwODk5MywiZXhwIjoyMDg2OTg0OTkzfQ.uAe73tgr2RtHY4RXLw48ChZeG5CSaKADCXQRcEnjbJw';
const H = { 'Content-Type': 'application/json', apikey: SRK, Authorization: 'Bearer ' + SRK };

const ADMIN = 'fac53fab-ee26-4651-966c-f4734359f12f';
const BUREAU = '948fbd30-8f22-4b42-a1b7-72af921c7738';
const COND = '1104576a-7ac1-47fe-aecd-ab4fd4ef3124';
const COND2 = '86e1bff6-5f9c-4878-8dc2-4360b33464e8';

async function post(table, body) {
    const r = await fetch(`${BASE}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...H, Prefer: 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify(body),
    });
    const d = await r.json();
    if (!r.ok) { console.error('ERR ' + table + ':', d.message || JSON.stringify(d)); return null; }
    return d;
}

async function main() {
    // 1. Create ALL profiles
    console.log('1. Creating profiles...');
    const profiles = await post('profiles', [
        { id: ADMIN, nom: 'Dupont', prenom: 'Pierre', email: 'admin@flash-rh.test', role: 'admin', actif: true },
        { id: BUREAU, nom: 'Martin', prenom: 'Sophie', email: 'bureau@flash-rh.test', role: 'bureau', actif: true },
        { id: COND, nom: 'Durand', prenom: 'Jean', email: 'conducteur@flash-rh.test', role: 'conducteur', profil_vehicule: 'PL', actif: true },
        { id: COND2, nom: 'Leroy', prenom: 'Marc', email: 'conducteur2@flash-rh.test', role: 'conducteur', profil_vehicule: 'VL', actif: true },
    ]);
    console.log('  Profiles:', profiles ? profiles.length : 'FAIL');

    // 2. Sync JWT claims
    console.log('2. Syncing JWT claims...');
    for (const [id, role] of [[ADMIN, 'admin'], [BUREAU, 'bureau'], [COND, 'conducteur'], [COND2, 'conducteur']]) {
        await fetch(`${BASE}/auth/v1/admin/users/${id}`, {
            method: 'PUT', headers: H,
            body: JSON.stringify({ app_metadata: { user_role: role } }),
        });
    }
    console.log('  JWT synced for all 4 users');

    // 3. Create absences for conducteur
    console.log('3. Creating absences...');
    const abs = await post('absences', [
        { employe_id: COND, type: 'cp', date_dernier_jour_travaille: '2026-03-10', date_reprise: '2026-03-17', statut: 'en_attente', derniere_minute: false },
        { employe_id: COND, type: 'maladie', date_dernier_jour_travaille: '2026-02-01', date_reprise: '2026-02-05', statut: 'validee', derniere_minute: false, validee_par: ADMIN },
    ]);
    console.log('  Absences:', abs ? abs.length : 'FAIL');

    // 4. Create notifications
    console.log('4. Creating notifications...');
    const notifs = await post('notifications', [
        { destinataire_id: COND, type: 'absence_validee', titre: 'Absence validee', contenu: 'Votre conge maladie du 01/02 au 05/02 a ete approuve.', lue: false, lien: '/absences' },
        { destinataire_id: COND, type: 'frais_soumis', titre: 'Releve soumis', contenu: 'Votre releve de frais de janvier a ete soumis.', lue: false, lien: '/frais' },
        { destinataire_id: COND, type: 'message', titre: 'Nouveau message', contenu: 'Rappel controle technique par Pierre Dupont.', lue: false, lien: '/messages' },
    ]);
    console.log('  Notifications:', notifs ? notifs.length : 'FAIL');

    // 5. Create releve
    console.log('5. Creating releve...');
    const perR = await fetch(`${BASE}/rest/v1/periodes_frais?select=id&statut=eq.ouverte&limit=1`, { headers: H });
    const periodes = await perR.json();
    if (periodes && periodes.length) {
        const rel = await post('releves_frais', {
            employe_id: COND, periode_id: periodes[0].id,
            statut: 'soumis', total_frais: 90, total_primes: 45, total_general: 135,
        });
        console.log('  Releve:', rel ? 'OK' : 'FAIL');
    } else {
        console.log('  No open period found, skipping releve');
    }

    console.log('\nALL DONE');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
