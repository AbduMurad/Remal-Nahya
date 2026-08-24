import type { Metadata } from 'next';
import { Header } from '@/components/chrome/Header';
import { TabBar } from '@/components/chrome/TabBar';
import { Footer } from '@/components/chrome/Footer';
import { CtaBand } from '@/components/sections/common';
import { getCopy } from '@/content';
import { LANGS, type Copy, type Lang, type Page } from '@/content/types';
import { hrefAbs } from './links';

export type PageProps = { params: Promise<{ lang: string }> };

export const resolve = async (params: PageProps['params']): Promise<Copy> => {
  const { lang } = await params;
  return getCopy((LANGS.includes(lang as Lang) ? lang : 'en') as Lang);
};

/** Title, description and the reciprocal hreflang pair, from the content model. */
export function metaFor(page: Page) {
  return async ({ params }: PageProps): Promise<Metadata> => {
    const c = await resolve(params);
    const langs = Object.fromEntries(
      LANGS.map((l) => [l, hrefAbs(l, page)]),
    ) as Record<string, string>;
    return {
      title: c.titles[page],
      description: c.descs[page],
      alternates: { canonical: hrefAbs(c.lang, page), languages: { ...langs, 'x-default': hrefAbs('en', page) } },
      openGraph: {
        title: c.titles[page],
        description: c.descs[page],
        locale: c.lang === 'ar' ? 'ar_LY' : 'en_US',
        alternateLocale: c.lang === 'ar' ? 'en_US' : 'ar_LY',
        type: 'website',
      },
    };
  };
}

/** Every page is the same sandwich: chrome, content, closing CTA, chrome. */
export function Shell({
  c, page, children, cta = true,
}: { c: Copy; page: Page; children: React.ReactNode; cta?: boolean }) {
  return (
    <>
      <Header c={c} page={page} />
      <main id="main">
        {children}
        {cta && <CtaBand c={c} />}
      </main>
      <Footer c={c} />
      <TabBar c={c} page={page} />
    </>
  );
}
