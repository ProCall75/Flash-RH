import { NextResponse } from 'next/server';

// Email notification API route using Resend
// Requires RESEND_API_KEY env variable
export async function POST(request: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'RESEND_API_KEY non configurée. Email non envoyé.' },
                { status: 200 } // 200 to avoid blocking the app flow
            );
        }

        const body = await request.json();
        const { to, subject, html, type } = body;

        if (!to || !subject) {
            return NextResponse.json({ error: 'to et subject sont requis' }, { status: 400 });
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: 'Flash RH <notifications@flash-transports.fr>',
                to: Array.isArray(to) ? to : [to],
                subject,
                html: html || getDefaultTemplate(subject, type),
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            return NextResponse.json(
                { error: `Erreur Resend: ${err.message || 'inconnue'}` },
                { status: 500 }
            );
        }

        const data = await response.json();
        return NextResponse.json({ success: true, id: data.id });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur interne' },
            { status: 500 }
        );
    }
}

function getDefaultTemplate(subject: string, type?: string): string {
    const color = type === 'urgent' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#9D1E00';
    return `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(-45deg, #9D1E00, #C44620); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Flash Transports RH</h1>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 16px; padding: 10px 16px; background: ${color}10; border-left: 3px solid ${color}; border-radius: 4px;">
                <p style="color: ${color}; font-weight: 600; margin: 0; font-size: 14px;">${subject}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">
                Connectez-vous au portail pour plus de détails.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://flash-rh.vercel.app'}" 
               style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #9D1E00; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">
                Accéder au portail →
            </a>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 16px;">
            Flash Transports © 2026 — Propulsé par PRAGMA
        </p>
    </div>
    `;
}
