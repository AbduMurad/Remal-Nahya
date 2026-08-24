import { SLUG, type Lang, type Page } from '@/content/types';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Route path for a page, WITHOUT basePath.
 *
 * `next/link` prepends basePath itself, so adding it here too produced
 * /Remal-Nahya/Remal-Nahya/en/. Use this for <Link>; use hrefAbs for a plain
 * <a>, for metadata, and for anything the framework does not rewrite.
 */
export function href(lang: Lang, page: Page, hash = ''): string {
  const slug = SLUG[page];
  return `${slug ? `/${lang}/${slug}/` : `/${lang}/`}${hash ? `#${hash}` : ''}`;
}

/** Same path with basePath applied — plain anchors, canonical and hreflang. */
export const hrefAbs = (lang: Lang, page: Page, hash = '') => `${BASE}${href(lang, page, hash)}`;

/** public/ files are not rewritten by the framework either. */
export const asset = (p: string) => `${BASE}${p.startsWith('/') ? p : `/${p}`}`;
