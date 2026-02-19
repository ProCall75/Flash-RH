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
        en_attente: 'badge-pending',
        validee: 'badge-approved',
        refusee: 'badge-rejected',
        brouillon: 'badge-info',
        soumis: 'badge-info',
        valide: 'badge-approved',
        corrige: 'badge-pending',
        conteste: 'badge-rejected',
        ouverte: 'badge-pending',
        resolue: 'badge-approved',
    };
    return colors[statut] || 'badge-info';
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
