import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export function formatDateShort(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
}

export function getAbsenceTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        cp: 'Congés payés',
        cp_anticipation: 'CP par anticipation',
        sans_solde: 'Congés sans solde',
        maladie: 'Maladie',
        accident_travail: 'Accident de travail',
        exceptionnelle: 'Absence exceptionnelle',
    };
    return labels[type] || type;
}

export function getStatutColor(statut: string): string {
    const colors: Record<string, string> = {
        en_attente: 'bg-amber-500/15 text-amber-400',
        validee: 'bg-emerald-500/15 text-emerald-400',
        refusee: 'bg-red-500/15 text-red-400',
        brouillon: 'bg-slate-500/15 text-slate-400',
        soumis: 'bg-blue-500/15 text-blue-400',
        valide: 'bg-emerald-500/15 text-emerald-400',
        corrige: 'bg-amber-500/15 text-amber-400',
        conteste: 'bg-red-500/15 text-red-400',
        ouverte: 'bg-amber-500/15 text-amber-400',
        resolue: 'bg-emerald-500/15 text-emerald-400',
    };
    return colors[statut] || 'bg-slate-500/15 text-slate-400';
}

export function getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
        en_attente: 'En attente',
        validee: 'Validée',
        refusee: 'Refusée',
        brouillon: 'Brouillon',
        soumis: 'Soumis',
        valide: 'Validé',
        corrige: 'Corrigé',
        conteste: 'Contesté',
        ouverte: 'Ouverte',
        cloturee: 'Clôturée',
        resolue: 'Résolue',
    };
    return labels[statut] || statut;
}
