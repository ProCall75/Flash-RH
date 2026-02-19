'use client';

import { useUser } from '@/lib/hooks/useUser';
import { OnboardingTour } from './OnboardingTour';

export function OnboardingWrapper() {
    const { profile, loading } = useUser();

    if (loading || !profile) return null;

    return (
        <OnboardingTour
            role={profile.role as 'admin' | 'bureau' | 'conducteur'}
            userName={profile.prenom}
        />
    );
}
