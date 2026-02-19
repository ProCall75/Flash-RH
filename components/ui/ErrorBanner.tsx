'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '14px 18px',
            background: 'var(--error-bg)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#991b1b',
            fontSize: '13px',
            fontWeight: 500,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{message}</span>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#991b1b',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all var(--transition-fast)',
                    }}
                >
                    <RefreshCw style={{ width: '12px', height: '12px' }} />
                    Réessayer
                </button>
            )}
        </div>
    );
}
