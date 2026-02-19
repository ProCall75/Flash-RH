'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

type UserRole = 'admin' | 'bureau' | 'conducteur';

interface OnboardingTourProps {
    role: UserRole;
    userName?: string;
}

const ONBOARDING_KEY = 'flash-rh-onboarding-completed';

function getAdminSteps(): DriveStep[] {
    return [
        {
            element: '#sidebar-brand',
            popover: {
                title: '🏢 Bienvenue sur votre portail RH',
                description: 'Flash Transports passe au digital ! Fini les formulaires papier — vos conducteurs et le bureau gèrent tout depuis cette interface.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#kpi-absences',
            popover: {
                title: '📋 Vos demandes en un coup d\'œil',
                description: 'Plus besoin de chercher dans les classeurs : voyez instantanément combien de demandes d\'absence attendent votre validation.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '#kpi-frais',
            popover: {
                title: '💰 Les relevés de frais remontent automatiquement',
                description: 'Chaque conducteur saisit ses frais en ligne. Vous recevez les relevés ici — plus de corrections à faire sur papier.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '#absence-calendar',
            popover: {
                title: '📅 Calendrier des absences',
                description: 'Visualisez en un clic qui est absent et quand. CP, maladie, accidents de travail — tous les types sont couverts. Planifiez sereinement les tournées.',
                side: 'left',
                align: 'start',
            },
        },
        {
            element: '#nav-absences',
            popover: {
                title: '✏️ Gestion des absences',
                description: 'Le formulaire papier de demande d\'absence est remplacé par un formulaire en ligne. CP, CP par anticipation, congés sans solde — le conducteur choisit, vous validez ou refusez en un clic.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-frais',
            popover: {
                title: '📊 Le relevé de frais numérique',
                description: 'Votre grille papier mensuelle (Repas RP, Casse-croûte, Nuit province PL…) est reproduite à l\'identique dans l\'app. Les conducteurs cochent leurs jours, les montants sont préremplis.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-messages',
            popover: {
                title: '💬 Messagerie interne',
                description: 'Remplacez WhatsApp et les SMS éparpillés. Notes de service, rappels, alertes urgentes — tout est centralisé et tracé.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-notifications',
            popover: {
                title: '🔔 Notifications temps réel',
                description: 'Quand un conducteur soumet un relevé ou demande une absence, vous êtes notifié. Plus rien ne passe entre les mailles du filet.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-equipe',
            popover: {
                title: '👥 Gestion de l\'équipe',
                description: 'Créez un compte pour chaque salarié. Attribuez un rôle (Admin, Bureau, Conducteur) et un type de véhicule (VL ou PL). L\'app s\'adapte automatiquement.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-parametres',
            popover: {
                title: '⚙️ Vos catégories de frais',
                description: 'Repas RP, Casse-croûte, Nuit Province PL, Départ dimanche, Samedi travaillé… Tous les montants sont ceux que vous utilisez déjà. Modifiez-les à tout moment.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-export',
            popover: {
                title: '📄 Export pour la comptabilité',
                description: 'Exportez les relevés de frais validés par période en PDF ou Excel. Un récapitulatif propre à transmettre directement au cabinet comptable.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#header-notifications',
            popover: {
                title: '🔴 Badge de notifications',
                description: 'Le nombre en rouge indique vos notifications non lues. Nouvelle absence soumise, relevé à valider — tout remonte ici.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            popover: {
                title: '🚀 C\'est parti !',
                description: 'Votre portail RH Flash Transports est prêt. Chaque conducteur reçoit ses identifiants et commence à saisir depuis son téléphone. Fini le papier !<br/><br/>Cliquez sur le bouton <strong>🎯 Découvrir</strong> dans le menu pour relancer cette visite à tout moment.',
            },
        },
    ];
}

function getConducteurSteps(): DriveStep[] {
    return [
        {
            element: '#sidebar-brand',
            popover: {
                title: '👋 Bienvenue sur Flash RH',
                description: 'Votre portail RH personnel. Fini les formulaires papier : absences, frais, primes — tout se fait ici.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-absences',
            popover: {
                title: '🏖️ Demander une absence',
                description: 'CP, congés sans solde, maladie — cliquez sur « + » pour envoyer votre demande directement à la direction. Vous serez notifié de la réponse.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-frais',
            popover: {
                title: '💶 Saisir vos frais',
                description: 'Cliquez « Saisir mes frais » pour retrouver votre grille habituelle. Cochez les jours, les montants sont préremplis (Repas RP, Casse-croûte…). Soumettez en un clic.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-messages',
            popover: {
                title: '📨 Messages de la direction',
                description: 'Notes de service, rappels, alertes urgentes — tout arrive ici. Plus besoin de chercher dans WhatsApp.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#nav-notifications',
            popover: {
                title: '🔔 Notifications',
                description: 'Absence validée ? Frais corrigé ? Vous le saurez immédiatement ici.',
                side: 'right',
                align: 'start',
            },
        },
        {
            element: '#header-notifications',
            popover: {
                title: '🔴 Ce badge vous tient informé',
                description: 'Le nombre en rouge = vos notifications non lues. Cliquez pour les consulter.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            popover: {
                title: '✅ Prêt à commencer !',
                description: 'Votre premier objectif : saisir votre relevé de frais du mois en cours. Cliquez sur « Mes frais » dans le menu.<br/><br/>Cliquez sur <strong>🎯 Découvrir</strong> pour relancer cette visite.',
            },
        },
    ];
}

export function OnboardingTour({ role, userName }: OnboardingTourProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    const startTour = useCallback(() => {
        // Ensure we're on the dashboard before starting
        if (pathname !== '/') {
            router.push('/');
            setTimeout(() => {
                launchDriver(role);
            }, 500);
        } else {
            launchDriver(role);
        }
    }, [pathname, router, role]);

    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => setIsReady(true), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        // Check if onboarding was already completed
        const completed = localStorage.getItem(ONBOARDING_KEY);
        if (!completed && pathname === '/') {
            // Auto-start on first visit
            setTimeout(() => startTour(), 300);
        }
    }, [isReady, pathname, startTour]);

    // Expose startTour globally so the header button can call it
    useEffect(() => {
        (window as any).__startOnboarding = startTour;
        return () => {
            delete (window as any).__startOnboarding;
        };
    }, [startTour]);

    return null; // This component is purely behavioral
}

function launchDriver(role: UserRole) {
    const steps = role === 'conducteur' ? getConducteurSteps() : getAdminSteps();

    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: 'rgba(24, 24, 27, 0.75)',
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: 'flash-rh-popover',
        progressText: '{{current}} / {{total}}',
        nextBtnText: 'Suivant →',
        prevBtnText: '← Retour',
        doneBtnText: 'Commencer ! 🚀',
        onDestroyStarted: () => {
            localStorage.setItem(ONBOARDING_KEY, 'true');
            driverObj.destroy();
        },
        steps,
    });

    driverObj.drive();
}

// Export for manual trigger (e.g., from Header button)
export function resetOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY);
}
