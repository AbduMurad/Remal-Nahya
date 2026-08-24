import Link from 'next/link';
import { Icon } from '@/components/svg/Icon';
import { LogoMark } from '@/components/svg/Diagrams';
import { href } from '@/lib/links';
import { FACTS, tel } from '@/content/facts';
import type { Copy, Page } from '@/content/types';

const COMPANY: Page[] = ['about', 'services', 'contact'];

export function Footer({ c }: { c: Copy }) {
  return (
    <footer className="foot">
      <div className="shell shell--wide">
        <div className="foot__grid">
          <div>
            <div className="logo">
              <span className="logo__mark"><LogoMark /></span>
              {c.lang === 'ar' ? (
                <span className="logo__wm logo__wm--ar"><b>رمال ناهية</b><i>للخدمات النفطية</i></span>
              ) : (
                <span className="logo__wm"><b>REMAL NAHYA</b><i>FOR OIL SERVICES</i></span>
              )}
            </div>
            <p className="foot__about">{c.foot.about}</p>
          </div>

          <div>
            <h4>{c.foot.c1}</h4>
            <ul>
              {COMPANY.map((p) => (
                <li key={p}><Link href={href(c.lang, p)} prefetch={false}>{c.nav[p]}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{c.foot.c2}</h4>
            <ul>
              {c.footServices.map(([p, label]) => (
                <li key={label}><Link href={href(c.lang, p)} prefetch={false}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{c.foot.c3}</h4>
            <ul>
              <li><a href={tel(FACTS.phone1)} className="ltr" dir="ltr">{FACTS.phone1}</a></li>
              <li><a href={tel(FACTS.phone2)} className="ltr" dir="ltr">{FACTS.phone2}</a></li>
              <li><a href={`mailto:${FACTS.email}`} className="ltr" dir="ltr">{FACTS.email}</a></li>
              <li>{c.lang === 'ar' ? FACTS.addressAr : FACTS.addressEn}</li>
            </ul>
          </div>
        </div>

        <div className="foot__bar">
          <span>{c.foot.legal}</span>
          <span style={{ color: 'var(--steel-400)' }}>{c.foot.built}</span>
          <div className="foot__soc">
            <a href="#" aria-label="LinkedIn"><Icon name="link" /></a>
            <a href={`https://${FACTS.site}`} aria-label={c.ui.website}><Icon name="globe" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
