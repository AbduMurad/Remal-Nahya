'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/svg/Icon';
import { LogoMark } from '@/components/svg/Diagrams';
import { href, hrefAbs } from '@/lib/links';
import { PAGES, type Copy, type Page } from '@/content/types';

/**
 * The full-six menu. The bottom bar carries five destinations on a phone; this
 * is where About, the language switch and the contact details live.
 */
export function Drawer({ c, page }: { c: Copy; page: Page }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        className="burger"
        id="burger"
        aria-label={c.ui.menu}
        aria-expanded={open}
        aria-controls="drawer"
        onClick={() => setOpen(true)}
      >
        <Icon name="menu" />
      </button>

      <div className="drawer" id="drawer" data-open={open ? 'true' : 'false'} ref={panel}>
        <div className="drawer__top">
          <Link className="logo" href={href(c.lang, 'index')} prefetch={false} onClick={() => setOpen(false)}>
            <span className="logo__mark"><LogoMark /></span>
            {c.lang === 'ar' ? (
              <span className="logo__wm logo__wm--ar"><b>رمال ناهية</b><i>للخدمات النفطية</i></span>
            ) : (
              <span className="logo__wm"><b>REMAL NAHYA</b><i>FOR OIL SERVICES</i></span>
            )}
          </Link>
          <button className="burger" id="drawerClose" aria-label={c.ui.close} onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>

        <nav aria-label={c.ui.mainNav}>
          {PAGES.map((p) => (
            <Link
              key={p}
              href={href(c.lang, p)}
              aria-current={p === page ? 'page' : undefined}
              prefetch={false}
              onClick={() => setOpen(false)}
            >
              {c.nav[p]}<Icon name="arrow" />
            </Link>
          ))}
        </nav>

        <div className="drawer__foot">
          <Link className="btn btn--primary" href={href(c.lang, 'contact')} prefetch={false} onClick={() => setOpen(false)}>
            {c.ctaNav}<Icon name="arrow" />
          </Link>
          <a className="btn btn--ghost" href={hrefAbs(c.other, page)} hrefLang={c.other} lang={c.other}>
            <Icon name="globe" />{c.otherLabel}
          </a>
        </div>
      </div>
    </>
  );
}
