import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flash RH — Portail Ressources Humaines',
  description: 'Portail RH de Flash Transports — Gestion des absences, frais et équipes',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9D1E00" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Flash RH" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `}} />
      </body>
    </html>
  );
}
