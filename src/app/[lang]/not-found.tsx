import Link from 'next/link';
import { href } from '@/lib/links';

export default function NotFound() {
  return (
    <html lang="en" dir="ltr">
      <body style={{ background: '#0B1533', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ display: 'grid', placeItems: 'center', minHeight: '100svh', padding: '2rem', textAlign: 'center' }}>
          <div>
            <p style={{ fontFamily: 'monospace', letterSpacing: '.2em', color: '#7C8DB5' }}>404</p>
            <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', margin: '.5rem 0 1.5rem' }}>Page not found</h1>
            <p style={{ color: '#B6C1D6', marginBottom: '2rem' }}>
              The page you asked for does not exist.
            </p>
            <Link href={href('en', 'index')} prefetch={false} style={{ background: '#C8102E', color: '#fff', padding: '.9em 1.6em', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>
              Remal Nahya — Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
