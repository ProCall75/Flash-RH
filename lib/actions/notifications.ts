import { createUntypedClient } from '@/lib/supabase/untyped-client';
import type { Notification } from '@/types/database';

function getClient() {
    return createUntypedClient();
}

export async function getNotifications(userId: string) {
    const supabase = getClient();
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('destinataire_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;
    return (data ?? []) as Notification[];
}

export async function getUnreadCount(userId: string) {
    const supabase = getClient();
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('destinataire_id', userId)
        .eq('lue', false);

    if (error) throw error;
    return count || 0;
}

export async function markNotificationRead(id: string) {
    const supabase = getClient();
    const { error } = await supabase
        .from('notifications')
        .update({ lue: true, lue_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
}

export async function markAllRead(userId: string) {
    const supabase = getClient();
    const { error } = await supabase
        .from('notifications')
        .update({ lue: true, lue_at: new Date().toISOString() })
        .eq('destinataire_id', userId)
        .eq('lue', false);

    if (error) throw error;
}
