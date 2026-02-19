#!/usr/bin/env node
/**
 * Flash RH — One-click Supabase setup
 * Run: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/setup-supabase.mjs
 * 
 * This script:
 * 1. Creates the 'attachments' storage bucket
 * 2. Applies the storage RLS policies
 * 3. Adds SUPABASE_SERVICE_ROLE_KEY to .env.local if missing
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jargxxcivmctajtngscq.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required.');
    console.error('   Usage: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/setup-supabase.mjs');
    console.error('   Find it in: Supabase Dashboard → Settings → API → service_role key');
    process.exit(1);
}

async function supabaseAPI(path, method = 'GET', body = null) {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
        method,
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
    });
    const text = await res.text();
    try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
    catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function main() {
    console.log('🚀 Flash RH — Supabase Setup\n');

    // 1. Create attachments bucket
    console.log('📦 STEP 1: Creating "attachments" storage bucket...');
    const bucketResult = await supabaseAPI('/storage/v1/bucket', 'POST', {
        id: 'attachments',
        name: 'attachments',
        public: true,
        file_size_limit: 10485760, // 10 MB
        allowed_mime_types: [
            'image/png', 'image/jpeg', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
    });

    if (bucketResult.ok) {
        console.log('   ✅ Bucket "attachments" created');
    } else if (bucketResult.status === 409) {
        console.log('   ℹ️  Bucket "attachments" already exists');
    } else {
        console.error('   ❌ Failed:', bucketResult.data);
    }

    // 2. Apply storage RLS policies via SQL
    console.log('\n🔒 STEP 2: Applying storage RLS policies...');
    const sql = `
        -- Allow authenticated users to upload
        DO $$ BEGIN
            CREATE POLICY "auth_upload_attachments" ON storage.objects
            FOR INSERT TO authenticated
            WITH CHECK (bucket_id = 'attachments');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        -- Allow public reads
        DO $$ BEGIN
            CREATE POLICY "public_read_attachments" ON storage.objects
            FOR SELECT TO public
            USING (bucket_id = 'attachments');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        -- Allow admins to delete
        DO $$ BEGIN
            CREATE POLICY "admin_delete_attachments" ON storage.objects
            FOR DELETE TO authenticated
            USING (bucket_id = 'attachments' AND get_my_role() = 'admin');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    `;

    const sqlResult = await supabaseAPI('/rest/v1/rpc/exec_sql', 'POST', { sql });
    // If exec_sql doesn't exist, try the pg endpoint
    if (!sqlResult.ok) {
        console.log('   ⚠️  Could not run SQL via RPC (exec_sql not available)');
        console.log('   ℹ️  Please run this SQL manually in Dashboard → SQL Editor:');
        console.log('   📋 File: supabase/migrations/008_storage_attachments.sql');
    } else {
        console.log('   ✅ Storage policies applied');
    }

    // 3. Add SERVICE_ROLE_KEY to .env.local if missing
    console.log('\n📝 STEP 3: Updating .env.local...');
    const envPath = '.env.local';
    let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';

    if (!envContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        envContent += `\n# Supabase Service Role (server-side only)\nSUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}\n`;
        writeFileSync(envPath, envContent);
        console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY added to .env.local');
    } else {
        console.log('   ℹ️  SUPABASE_SERVICE_ROLE_KEY already in .env.local');
    }

    console.log('\n✅ Setup complete!');
    console.log('\n📋 Remaining manual steps (if SQL failed):');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Copy & paste contents of: supabase/migrations/008_storage_attachments.sql');
    console.log('   3. Click "Run"');
}

main().catch(console.error);
