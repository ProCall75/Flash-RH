import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// J17 Alert: Check if it's the 17th of the month and send reminders
// to conducteurs who haven't submitted their expense reports
export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            return NextResponse.json({ error: 'Service role key non configurée' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        const today = new Date();
        const dayOfMonth = today.getDate();

        // Only run on the 17th (or allow force via query param)
        // In production, trigger this via a CRON job
        if (dayOfMonth !== 17) {
            return NextResponse.json({ message: `Pas le J17 (jour actuel: ${dayOfMonth})`, skipped: true });
        }

        // Current period: YYYY-MM
        const currentPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        // Get all active conducteurs
        const { data: conducteurs, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email, prenom, nom')
            .eq('role', 'conducteur')
            .eq('actif', true);

        if (profilesError) throw profilesError;

        // Get all releves for this period
        const { data: releves, error: relevesError } = await supabase
            .from('releves_frais')
            .select('employe_id')
            .eq('periode', currentPeriod)
            .in('statut', ['soumis', 'valide']);

        if (relevesError) throw relevesError;

        const submittedIds = new Set((releves || []).map((r: { employe_id: string }) => r.employe_id));
        const notSubmitted = (conducteurs || []).filter((c: { id: string }) => !submittedIds.has(c.id));

        // Create notifications in the DB for each
        const notifications = notSubmitted.map((c: { id: string }) => ({
            profil_id: c.id,
            contenu: `⚠️ Rappel J17 : Vous n'avez pas encore soumis votre relevé de frais pour la période ${currentPeriod}. Veuillez le faire au plus tôt.`,
            lu: false,
        }));

        if (notifications.length > 0) {
            const { error: notifError } = await supabase
                .from('notifications')
                .insert(notifications);

            if (notifError) throw notifError;
        }

        // Optionally send emails
        const apiKey = process.env.RESEND_API_KEY;
        let emailsSent = 0;

        if (apiKey && notSubmitted.length > 0) {
            for (const c of notSubmitted) {
                const typedC = c as { email: string; prenom: string; nom: string };
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/notifications/email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: typedC.email,
                            subject: `⚠️ Rappel J17 — Relevé de frais ${currentPeriod}`,
                            type: 'warning',
                        }),
                    });
                    emailsSent++;
                } catch {
                    // Continue even if email fails
                }
            }
        }

        return NextResponse.json({
            success: true,
            period: currentPeriod,
            totalConducteurs: conducteurs?.length || 0,
            alreadySubmitted: submittedIds.size,
            notified: notSubmitted.length,
            emailsSent,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur interne' },
            { status: 500 }
        );
    }
}
