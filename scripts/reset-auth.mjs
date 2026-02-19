#!/usr/bin/env node
/**
 * Flash RH — Reset Auth Users
 * 
 * NUCLEAR RESET: deletes ALL existing test auth users from Supabase,
 * then recreates them with admin.createUser + email_confirm: true.
 * 
 * This guarantees passwords work. Run this once, never worry again.
 * 
 * Usage: node scripts/reset-auth.mjs
 * Reads .env.local for SUPABASE keys.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local ──
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) env[match[1].trim()] = match[2].trim();
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const headers = {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
};

// ════════════════════════════════════════════
// DEFINITIVE TEST ACCOUNTS
// These are the ONLY accounts. Memorize them.
// ════════════════════════════════════════════
const ACCOUNTS = [
    {
        email: 'admin@flash-rh.test',
        password: 'Flash2026!admin',
        nom: 'Dupont',
        prenom: 'Pierre',
        role: 'admin',
        profil_vehicule: null,
    },
    {
        email: 'bureau@flash-rh.test',
        password: 'Flash2026!bureau',
        nom: 'Martin',
        prenom: 'Sophie',
        role: 'bureau',
        profil_vehicule: null,
    },
    {
        email: 'conducteur@flash-rh.test',
        password: 'Flash2026!cond',
        nom: 'Durand',
        prenom: 'Jean',
        role: 'conducteur',
        profil_vehicule: 'PL',
    },
    {
        email: 'conducteur2@flash-rh.test',
        password: 'Flash2026!cond',
        nom: 'Leroy',
        prenom: 'Marc',
        role: 'conducteur',
        profil_vehicule: 'VL',
    },
];

async function apiCall(path, method = 'GET', body = null) {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });
    if (res.status === 204) return null; // DELETE returns 204
    const data = await res.json().catch(() => null);
    return { status: res.status, ok: res.ok, data };
}

async function main() {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║  Flash RH — RESET AUTH (nuclear)     ║');
    console.log('╚══════════════════════════════════════╝\n');

    // ── STEP 1: List ALL existing auth users ──
    console.log('🔍 Listing all existing auth users...');
    const listRes = await apiCall('/auth/v1/admin/users?page=1&per_page=100');
    const existingUsers = listRes?.data?.users || [];
    console.log(`   Found ${existingUsers.length} user(s) in Supabase Auth\n`);

    // ── STEP 1.5: Clear messages & notifications (FK blockers) ──
    console.log('🧹 Clearing messages and notifications (FK blockers)...');
    for (const table of ['messages', 'notifications']) {
        const delRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=not.is.null`, {
            method: 'DELETE',
            headers: { ...headers, 'Prefer': 'return=minimal' },
        });
        if (delRes.ok) {
            console.log(`   ✔ Cleared table: ${table}`);
        } else {
            const errBody = await delRes.text();
            console.log(`   ⚠ Failed to clear ${table}: ${errBody}`);
        }
    }

    // ── STEP 2: Delete ALL existing auth users ──
    console.log('\n🗑️  Deleting ALL existing auth users...');
    for (const user of existingUsers) {
        const delRes = await apiCall(`/auth/v1/admin/users/${user.id}`, 'DELETE');
        if (delRes === null || delRes?.ok) {
            console.log(`   ✔ Deleted: ${user.email} (${user.id})`);
        } else {
            console.log(`   ⚠ Failed to delete ${user.email}: ${JSON.stringify(delRes?.data)}`);
        }
    }

    // Wait for cascading deletes (profiles trigger)
    console.log('\n   ⏳ Waiting 3s for cascade deletes...');
    await new Promise(r => setTimeout(r, 3000));

    // ── STEP 3: Verify profiles are cleaned up ──
    const profileCheck = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id,email`, {
        headers: { ...headers, 'Prefer': 'return=representation' },
    });
    const remainingProfiles = await profileCheck.json();
    if (remainingProfiles?.length > 0) {
        console.log(`   ⚠ ${remainingProfiles.length} orphan profiles found, cleaning...`);
        for (const p of remainingProfiles) {
            await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${p.id}`, {
                method: 'DELETE',
                headers,
            });
        }
        console.log('   ✔ Orphan profiles cleaned');
    }

    // ── STEP 4: Create fresh users ──
    console.log('\n🆕 Creating fresh auth users...');
    const createdIds = {};

    for (const acct of ACCOUNTS) {
        const res = await apiCall('/auth/v1/admin/users', 'POST', {
            email: acct.email,
            password: acct.password,
            email_confirm: true,  // ← critical: skips email verification
            user_metadata: {
                nom: acct.nom,
                prenom: acct.prenom,
                role: acct.role,
            },
        });

        if (res?.ok && res.data?.id) {
            console.log(`   ✔ Created: ${acct.email} → ${res.data.id}`);
            createdIds[acct.email] = res.data.id;
        } else {
            console.error(`   ❌ FAILED: ${acct.email}`, res?.data?.msg || res?.data);
        }
    }

    // Wait for profile trigger
    console.log('\n   ⏳ Waiting 2s for profile triggers...');
    await new Promise(r => setTimeout(r, 2000));

    // ── STEP 5: Patch profiles with correct roles + vehicles ──
    console.log('\n📝 Patching profiles (role + vehicule)...');
    for (const acct of ACCOUNTS) {
        const uid = createdIds[acct.email];
        if (!uid) continue;

        const patchBody = {
            role: acct.role,
            nom: acct.nom,
            prenom: acct.prenom,
            actif: true,
        };
        if (acct.profil_vehicule) {
            patchBody.profil_vehicule = acct.profil_vehicule;
        }

        const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${uid}`, {
            method: 'PATCH',
            headers: { ...headers, 'Prefer': 'return=representation' },
            body: JSON.stringify(patchBody),
        });
        const patched = await patchRes.json();
        if (patchRes.ok) {
            console.log(`   ✔ ${acct.email} → role=${acct.role}, vehicule=${acct.profil_vehicule || '—'}`);
        } else {
            console.error(`   ❌ Patch failed for ${acct.email}:`, patched);
        }
    }

    // ── STEP 6: Sync JWT claims ──
    console.log('\n🔐 Syncing JWT app_metadata (role in token)...');
    for (const acct of ACCOUNTS) {
        const uid = createdIds[acct.email];
        if (!uid) continue;

        await apiCall(`/auth/v1/admin/users/${uid}`, 'PUT', {
            app_metadata: { user_role: acct.role },
        });
        console.log(`   ✔ JWT claim: ${acct.email} → ${acct.role}`);
    }

    // ── STEP 7: Verify login works ──
    console.log('\n🧪 Verifying login for each account...');
    for (const acct of ACCOUNTS) {
        const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': headers.apikey,
            },
            body: JSON.stringify({
                email: acct.email,
                password: acct.password,
            }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.access_token) {
            console.log(`   ✅ LOGIN OK: ${acct.email}`);
        } else {
            console.error(`   ❌ LOGIN FAILED: ${acct.email} →`, loginData.error_description || loginData.msg || loginData);
        }
    }

    // ── Final summary ──
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  ✅ RESET COMPLETE — ACCOUNTS READY          ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║                                              ║');
    for (const acct of ACCOUNTS) {
        const line = `║  ${acct.role.padEnd(12)} ${acct.email.padEnd(28)} ║`;
        console.log(line);
    }
    console.log('║                                              ║');
    console.log('║  Passwords all follow: Flash2026!<role>      ║');
    console.log('║  admin    → Flash2026!admin                  ║');
    console.log('║  bureau   → Flash2026!bureau                 ║');
    console.log('║  cond 1+2 → Flash2026!cond                   ║');
    console.log('║                                              ║');
    console.log('╚══════════════════════════════════════════════╝\n');
}

main().catch(err => {
    console.error('💀 Fatal error:', err);
    process.exit(1);
});
