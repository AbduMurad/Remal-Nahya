import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/svg/Icon';
import type { IconName, Lang } from '@/content/types';
import { img, srcSet, fallback, type ImageName } from '@/lib/images';

/* ------------------------------------------------------------------ type */

/** Shared modules carry an `NN — ` index that only reads correctly in the
 *  homepage sequence; strip it everywhere else. */
export function Eyebrow({ children, home = false }: { children: string; home?: boolean }) {
  const text = home ? children : children.replace(/^\d{2}\s*[—-]\s*/, '');
  return <div className="eyebrow">{text}</div>;
}

/* --------------------------------------------------------------- actions */

type BtnKind = 'primary' | 'ghost' | 'dark' | 'line';

/**
 * Every internal Link sets prefetch={false}.
 *
 * App Router prefetches in-viewport links by default, which for twelve static
 * pages carrying large inline SVG meant ~2.5 MB of route payloads pulled down
 * before anyone clicked anything. On the connections this site is actually
 * opened over, that is the wrong trade: navigation stays fast enough on click,
 * and the first page costs a fraction as much.
 */

export function Btn({
  href, children, kind = 'primary', icon = 'arrow', external = false,
}: {
  href: string; children: ReactNode; kind?: BtnKind; icon?: IconName | null; external?: boolean;
}) {
  const cls = `btn btn--${kind}`;
  const inner = <>{children}{icon && <Icon name={icon} />}</>;
  return external
    ? <a className={cls} href={href}>{inner}</a>
    : <Link className={cls} href={href} prefetch={false}>{inner}</Link>;
}

export function TLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="tlink" href={href} prefetch={false}>{children}<Icon name="arrow" /></Link>;
}

/* ----------------------------------------------------------------- lists */

export function Tick({ items }: { items: string[] }) {
  return (
    <ul className="tick">
      {items.map((t) => (
        <li key={t}><Icon name="check" /><span>{t}</span></li>
      ))}
    </ul>
  );
}

/* --------------------------------------------------------------- imagery */

/**
 * A responsive photograph. The blurred placeholder is painted as a background
 * so nothing flashes white while the real file arrives — which matters on the
 * connections this site is actually opened over.
 */
export function Photo({
  name, alt, className = '', sizes = '100vw', priority = false,
}: {
  name: ImageName; alt: string; className?: string; sizes?: string; priority?: boolean;
}) {
  const e = img(name);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`photo ${className}`.trim()}
      src={fallback(e)}
      srcSet={srcSet(e)}
      sizes={sizes}
      width={e.w}
      height={e.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={{ backgroundImage: `url(${e.lqip})`, backgroundSize: 'cover' }}
    />
  );
}

/** Full-bleed decorative backdrop. Never carries meaning, so alt is empty. */
export function PhotoBg({ name, className = '' }: { name: ImageName; className?: string }) {
  const e = img(name);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`bgphoto ${className}`.trim()}
      src={fallback(e)}
      srcSet={srcSet(e)}
      sizes="100vw"
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
    />
  );
}

/* ------------------------------------------------------------------ bidi */

/**
 * Latin and numeric runs inside Arabic prose must be bidi-isolated, or a string
 * like "Rompetrol Well Services وSCA-Sichuan" reorders at the boundary and
 * breaks across lines in the wrong place.
 */
const LATIN_RUN =
  /((?:[A-Za-zÀ-ɏ0-9][A-Za-zÀ-ɏ0-9&/+._,@·-]*)(?:[  ](?:[A-Za-zÀ-ɏ0-9][A-Za-zÀ-ɏ0-9&/+._,@·-]*))*)/g;

export function Bidi({ text, lang }: { text: string; lang: Lang }) {
  if (lang !== 'ar') return <>{text}</>;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LATIN_RUN.lastIndex = 0;
  while ((m = LATIN_RUN.exec(text)) !== null) {
    let run = m[1];
    if (!/[A-Za-zÀ-ɏ]/.test(run)) continue;          // bare numerals read fine in RTL
    let tail = '';
    while (run && (run.endsWith('.') || run.endsWith(','))) {
      tail = run.slice(-1) + tail;
      run = run.slice(0, -1);
    }
    if (!run) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<bdi key={`${m.index}-${run}`}>{run}</bdi>);
    if (tail) out.push(tail);
    last = m.index + m[1].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Phone numbers, emails and part codes stay LTR inside RTL prose. */
export function Ltr({ children }: { children: ReactNode }) {
  return <span className="ltr" dir="ltr">{children}</span>;
}
