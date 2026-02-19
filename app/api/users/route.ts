import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, nom, prenom, role, profil_vehicule } = body;

        if (!email || !password || !nom || !prenom || !role) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            return NextResponse.json({ error: 'Service role key non configurée' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            app_metadata: { user_role: role },
            user_metadata: { nom, prenom },
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Update profile with nom, prenom, role, profil_vehicule
        if (authData.user) {
            await supabaseAdmin
                .from('profiles')
                .update({
                    nom,
                    prenom,
                    role,
                    profil_vehicule: profil_vehicule || null,
                    actif: true,
                })
                .eq('id', authData.user.id);
        }

        return NextResponse.json({ user: authData.user }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur interne' },
            { status: 500 }
        );
    }
}
