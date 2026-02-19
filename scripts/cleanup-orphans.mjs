#!/usr/bin/env node
/**
 * Full data cleanup + re-seed with new user IDs.
 * Deletes ALL rows from dependent tables (in FK order), then re-runs seed.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^([^#=]+)=(.+)$/);
    if (m) env[m[1].trim()] = m[2].trim();
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
    'Content-Type': 'application/json',
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
};

async function deleteAll(table) {
    // Delete all rows by using a trivially-true filter
    const res = await fetch(`${URL}/rest/v1/${table}?id=neq.00000000-0000-0000-0000-000000000000`, {
        method: 'DELETE',
        headers,
    });
    console.log(`  ${res.ok ? '✔' : '❌'} ${table} → ${res.status}`);
}

async function main() {
    console.log('🧹 Cleaning ALL data tables (FK order)...\n');

    // Delete in FK dependency order (children first)
    await deleteAll('lignes_frais');
    await deleteAll('lignes_primes');
    await deleteAll('releves_frais');
    await deleteAll('notifications');
    await deleteAll('messages');
    await deleteAll('absences');

    // Now delete orphan profiles that don't match any auth user
    const aRes = await fetch(`${URL}/auth/v1/admin/users?page=1&per_page=100`, { method: 'GET', headers });
    const auth = await aRes.json();
    const authIds = new Set(auth.users.map(u => u.id));

    const pRes = await fetch(`${URL}/rest/v1/profiles?select=id,email`, {
        headers: { ...headers, 'Prefer': 'return=representation' },
    });
    const profiles = await pRes.json();

    for (const p of profiles) {
        if (!authIds.has(p.id)) {
            await fetch(`${URL}/rest/v1/profiles?id=eq.${p.id}`, { method: 'DELETE', headers });
            console.log(`  ✔ Deleted orphan profile: ${p.email}`);
        }
    }

    console.log('\n✅ Cleanup complete. Run seed.mjs now.');
}

main().catch(console.error);
