'use client';

import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

interface UserContextType {
    profile: Profile | null;
    loading: boolean;
    isAdmin: boolean;
    isBureau: boolean;
    isConducteur: boolean;
    refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
    profile: null,
    loading: true,
    isAdmin: false,
    isBureau: false,
    isConducteur: false,
    refresh: async () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    async function fetchProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        setProfile(data as Profile | null);
        setLoading(false);
    }

    useEffect(() => {
        fetchProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchProfile();
        });

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value: UserContextType = {
        profile,
        loading,
        isAdmin: profile?.role === 'admin',
        isBureau: profile?.role === 'bureau',
        isConducteur: profile?.role === 'conducteur',
        refresh: fetchProfile,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
