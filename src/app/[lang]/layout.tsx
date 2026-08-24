import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '@/styles/fonts.css';
import '@/styles/site.css';
import { getCopy } from '@/content';
import { LANGS, type Lang } from '@/content/types';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#0B1533',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',        // so env(safe-area-inset-*) is non-zero on iPhone
};

export const metadata: Metadata = {
  metadataBase: new URL('https://remalnahya.com'),
  icons: {
    icon: [{
      url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 104 128'%3E" +
        "%3Cpath d='M52 3C52 3 97 52 97 80a45 45 0 0 1-90 0C7 52 52 3 52 3Z' fill='%231B2A5B'/%3E" +
        "%3Cpath d='M38 96 52 38 66 96M43 76h18M40 87h24' stroke='%23C8102E' stroke-width='7' " +
        "fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
    }],
  },
};

export default async function LangLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  const c = getCopy(lang as Lang);
  return (
    <html lang={c.lang} dir={c.dir}>
      <body>{children}</body>
    </html>
  );
}
