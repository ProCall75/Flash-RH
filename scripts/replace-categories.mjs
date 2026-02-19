#!/usr/bin/env node
/**
 * Flash RH — Replace expense categories
 * Deletes old 8 categories, inserts correct 21 from Brice's paper grid.
 * 
 * Usage: node scripts/replace-categories.mjs
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jargxxcivmctajtngscq.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphcmd4eGNpdm1jdGFqdG5nc2NxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwODk5MywiZXhwIjoyMDg2OTg0OTkzfQ.uAe73tgr2RtHY4RXLw48ChZeG5CSaKADCXQRcEnjbJw';

const headers = {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
};

async function restDelete(table, query) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
        method: 'DELETE',
        headers: { ...headers, 'Prefer': 'return=representation' },
    });
    const data = await res.json().catch(() => []);
    if (!res.ok) {
        console.error(`  ❌ DELETE ${table}: ${res.status}`, data);
        return null;
    }
    return data;
}

async function restInsert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=representation' },
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

async function main() {
    console.log('🔄 Flash RH — Replace Expense Categories');
    console.log('=========================================\n');

    // Step 1: Check current categories
    const oldCats = await restSelect('categories_frais', 'select=id,nom,type&order=ordre_affichage');
    console.log(`📊 Current categories: ${oldCats?.length || 0}`);
    if (Array.isArray(oldCats)) {
        oldCats.forEach(c => console.log(`   - [${c.type}] ${c.nom}`));
    }

    // Step 2: Delete lignes_frais that reference old categories (FK constraint)
    console.log('\n🗑️  Step 1: Deleting lignes_frais...');
    const delFrais = await restDelete('lignes_frais', 'id=not.is.null');
    console.log(`   Deleted ${delFrais?.length ?? '?'} lignes_frais`);

    // Step 3: Delete lignes_primes that reference old categories (FK constraint)
    console.log('🗑️  Step 2: Deleting lignes_primes...');
    const delPrimes = await restDelete('lignes_primes', 'id=not.is.null');
    console.log(`   Deleted ${delPrimes?.length ?? '?'} lignes_primes`);

    // Step 4: Delete old categories
    console.log('🗑️  Step 3: Deleting old categories...');
    const delCats = await restDelete('categories_frais', 'id=not.is.null');
    console.log(`   Deleted ${delCats?.length ?? '?'} categories`);

    // Step 5: Insert new categories (10 frais + 11 primes)
    console.log('\n✨ Step 4: Inserting 21 new categories...');
    const newCategories = [
        // ── 10 FRAIS (grille papier Brice) ──
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
        // ── 11 PRIMES (grille papier Brice) ──
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

    const result = await restInsert('categories_frais', newCategories);
    console.log(`   ✅ Inserted ${result?.length || 0} categories`);

    // Step 6: Verify
    console.log('\n📊 Verification:');
    const finalCats = await restSelect('categories_frais', 'select=id,nom,montant_defaut,profil_vehicule,type&order=ordre_affichage');
    const frais = finalCats?.filter(c => c.type === 'frais') || [];
    const primes = finalCats?.filter(c => c.type === 'prime') || [];
    console.log(`   Frais: ${frais.length} (expected: 10)`);
    frais.forEach(c => console.log(`     ${c.nom} — ${c.montant_defaut}€ — ${c.profil_vehicule}`));
    console.log(`   Primes: ${primes.length} (expected: 11)`);
    primes.forEach(c => console.log(`     ${c.nom} — ${c.montant_defaut}€ — ${c.profil_vehicule}`));
    console.log(`\n✅ TOTAL: ${finalCats?.length || 0} categories (expected: 21)`);
}

main().catch(console.error);
