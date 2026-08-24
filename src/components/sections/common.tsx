import Link from 'next/link';
import { Icon } from '@/components/svg/Icon';
import { HeroOverlay, DroneScene, LibyaMap } from '@/components/svg/Diagrams';
import { Reveal, Counter } from '@/components/ui/client';
import { Btn, Eyebrow, Photo, PhotoBg, Tick, TLink, Bidi } from '@/components/ui';
import { href } from '@/lib/links';
import { FACTS, tel } from '@/content/facts';
import type { Copy, Page, Stat } from '@/content/types';

/* ------------------------------------------------------------- page head */

export function PageHead({
  c, page, image, h, lede,
}: {
  c: Copy; page: Page; image: 'ph-services' | 'ph-ega' | 'ph-well' | 'ph-about' | 'ph-contact';
  h: string; lede: string;
}) {
  return (
    <section className="phead">
      <PhotoBg name={image} className="phead__bg" />
      <div className="shell">
        <div className="phead__in">
          <div className="crumb">
            <Link href={href(c.lang, 'index')} prefetch={false}>{c.nav.index}</Link>
            <i>/</i>
            <span>{c.nav[page]}</span>
          </div>
          <Reveal as="div"><h1>{h}</h1></Reveal>
          <Reveal as="div" delay={1}><p className="lede"><Bidi text={lede} lang={c.lang} /></p></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ stat band */

export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="statband">
      <div className="shell shell--wide">
        <div className="statband__in">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <Counter value={s.n} group={s.group} post={s.post} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- hero + tick */

export function Hero({ c }: { c: Copy }) {
  const h = c.hero;
  return (
    <>
      <section className="hero grain">
        <PhotoBg name="hero" className="hero__bg" />
        <HeroOverlay />
        <div className="shell shell--wide">
          <div className="hero__in">
            <Reveal as="div">
              <div className="hero__badge"><i />{h.badge}</div>
            </Reveal>
            <Reveal as="div" delay={1}>
              {/* each clause is kept unbreakable, so the staccato reads as three
                  statements rather than wrapping mid-phrase */}
              <h1>
                <span className="hl">{h.h1a}</span>{' '}
                <span className="hl stop">{h.h1b}</span>{' '}
                <span className="hl">{h.h1c}</span>
              </h1>
            </Reveal>
            <Reveal as="div" delay={2}>
              <p className="lede"><Bidi text={h.lede} lang={c.lang} /></p>
            </Reveal>
            <Reveal as="div" delay={3}>
              <div className="btn-row">
                <Btn href={href(c.lang, 'contact')}>{h.cta1}</Btn>
                <Btn href={href(c.lang, 'services')} kind="ghost">{h.cta2}</Btn>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <StatBand stats={c.stats} />
      <Ticker items={c.ticker} />
    </>
  );
}

export function Ticker({ items }: { items: string[] }) {
  const run = [...items, ...items];
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker__t">
        {run.map((t, i) => <span key={`${t}-${i}`}>{t}</span>)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- cta band */

export function CtaBand({ c }: { c: Copy }) {
  return (
    <section className="ctaband grain">
      <div className="shell">
        <div className="ctaband__in">
          <Reveal as="div">
            <h2>{c.ctaBand.h}</h2>
            <p className="lede"><Bidi text={c.ctaBand.p} lang={c.lang} /></p>
          </Reveal>
          <div className="btn-row" style={{ margin: 0 }}>
            <Btn href={href(c.lang, 'contact')}>{c.ctaBand.b1}</Btn>
            <a className="btn btn--ghost" href={tel(FACTS.phone1)}>
              <Icon name="phone" /><span className="ltr" dir="ltr">{FACTS.phone1}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- partners */

export function Partners({ c }: { c: Copy }) {
  return (
    <section className="sec sec--darkest" id="partners" style={{ position: 'relative', overflow: 'hidden' }}>
      <PhotoBg name="partners" className="sec__bg" />
      <div className="shell" style={{ position: 'relative', zIndex: 2 }}>
        <Reveal as="div" className="sec-head">
          <Eyebrow home>{c.partners.eyebrow}</Eyebrow>
          <h2>{c.partners.h}</h2>
          <p className="lede"><Bidi text={c.partners.lede} lang={c.lang} /></p>
        </Reveal>
        {c.partnerList.map((x, i) => (
          <Reveal as="article" className="partner" delay={i} key={x.h}>
            <div className="partner__n">{x.n} · {x.c}</div>
            <div className="partner__b">
              <h3>{x.h}</h3>
              <p><Bidi text={x.p} lang={c.lang} /></p>
              <div className="partner__tags">
                {x.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div className="partner__f"><Icon name="link" /></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- drone */

export function DroneSection({ c }: { c: Copy }) {
  const d = c.drone;
  return (
    <section className="sec sec--dark" id="drone">
      <div className="shell">
        <div className="split split--40" style={{ alignItems: 'center' }}>
          <Reveal as="div">
            <Eyebrow home>{d.eyebrow}</Eyebrow>
            <h2>{d.h}</h2>
            <p className="lede" style={{ marginBlockStart: '1.25rem' }}>
              <Bidi text={d.lede} lang={c.lang} />
            </p>
            <Tick items={d.li} />
            <div className="srv__by" style={{ marginBlockStart: '1.5rem' }}>{d.by}</div>
            <div className="btn-row"><Btn href={href(c.lang, 'contact')}>{d.cta}</Btn></div>
          </Reveal>
          <Reveal as="div" className="dronewrap" delay={1}><DroneScene /></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- coverage */

export function Coverage({ c }: { c: Copy }) {
  const m = c.map;
  return (
    <section className="sec sec--darkest" id="coverage">
      <div className="shell">
        <div className="split" style={{ alignItems: 'center' }}>
          <Reveal as="div" className="mapwrap"><LibyaMap /></Reveal>
          <Reveal as="div" delay={1}>
            <Eyebrow home>{m.eyebrow}</Eyebrow>
            <h2>{m.h}</h2>
            <p className="lede" style={{ marginBlockStart: '1.25rem' }}>
              <Bidi text={m.lede} lang={c.lang} />
            </p>
            <Tick items={m.li} />
            <div className="btn-row">
              <Btn href={href(c.lang, 'contact')} kind="ghost" icon="pin">{m.cta}</Btn>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ lead time */

export function LeadTime({ c }: { c: Copy }) {
  return (
    <section className="sec sec--darkest">
      <div className="shell">
        <Reveal as="div" className="sec-head">
          <Eyebrow>{c.lead.eyebrow}</Eyebrow>
          <h2>{c.lead.h}</h2>
          <p className="lede"><Bidi text={c.lead.lede} lang={c.lang} /></p>
        </Reveal>
        <div className="lead">
          {c.lead.rows.map((r, i) => (
            <Reveal as="div" className="lead__row" delay={i} key={r.k}>
              <div className="lead__k">{r.k}</div>
              <div className="lead__v num" dir="ltr">{r.v}</div>
              <div className="lead__d"><Bidi text={r.d} lang={c.lang} /></div>
              <div className="lead__t"><span>{r.tag}</span></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TLink, Photo };
