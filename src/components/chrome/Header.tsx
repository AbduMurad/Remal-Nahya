import Link from 'next/link';
import { Icon } from '@/components/svg/Icon';
import { LogoMark } from '@/components/svg/Diagrams';
import { Drawer } from './Drawer';
import { href, hrefAbs } from '@/lib/links';
import { FACTS, tel } from '@/content/facts';
import { PAGES, type Copy, type Page } from '@/content/types';
import { Btn } from '@/components/ui';
import { ChromeEffects } from '@/components/ui/client';

export function Logo({ c }: { c: Copy }) {
  return (
    <Link className="logo" href={href(c.lang, 'index')} prefetch={false}>
      <span className="logo__mark"><LogoMark /></span>
      {c.lang === 'ar' ? (
        <span className="logo__wm logo__wm--ar"><b>رمال ناهية</b><i>للخدمات النفطية</i></span>
      ) : (
        <span className="logo__wm"><b>REMAL NAHYA</b><i>FOR OIL SERVICES</i></span>
      )}
    </Link>
  );
}

export function Header({ c, page }: { c: Copy; page: Page }) {
  const otherHref = hrefAbs(c.other, page);
  return (
    <>
      <a className="skip" href="#main">{c.skip}</a>
      <ChromeEffects />

      <div className="topbar">
        <div className="shell shell--wide">
          <div className="topbar__in">
            <div className="depots">
              {c.depots.map((d) => <span key={d}><i />{d}</span>)}
            </div>
            <div className="topbar__r">
              <a href={tel(FACTS.phone1)} className="ltr" dir="ltr">{FACTS.phone1}</a>
              <a href={`mailto:${FACTS.email}`} className="ltr" dir="ltr">{FACTS.email}</a>
            </div>
          </div>
        </div>
      </div>

      <header className="hdr">
        <div className="shell shell--wide">
          <div className="hdr__in">
            <Logo c={c} />
            <nav className="nav" aria-label={c.ui.mainNav}>
              {PAGES.map((p) => (
                <Link
                  key={p}
                  href={href(c.lang, p)}
                  aria-current={p === page ? 'page' : undefined} prefetch={false}>
                  {c.nav[p]}
                </Link>
              ))}
            </nav>
            <div className="hdr__cta">
              <a className="lang" href={otherHref} hrefLang={c.other} lang={c.other}>
                <Icon name="globe" />{c.otherLabel}
              </a>
              <Btn href={href(c.lang, 'contact')}>{c.ctaNav}</Btn>
              <Drawer c={c} page={page} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
