import { Hero, Partners, DroneSection, Coverage, LeadTime, PageHead } from '@/components/sections/common';
import { WellScroller } from '@/components/sections/WellScroller';
import { Btn, Eyebrow, Photo, TLink, Tick, Bidi } from '@/components/ui';
import { Reveal } from '@/components/ui/client';
import { Icon } from '@/components/svg/Icon';
import { href } from '@/lib/links';
import { Shell, metaFor, resolve, type PageProps } from '@/lib/page';

export const generateMetadata = metaFor('index');

export default async function Home({ params }: PageProps) {
  const c = await resolve(params);
  const ex = c.excl;

  return (
    <Shell c={c} page="index">
      <Hero c={c} />

      {/* three pillars */}
      <section className="sec sec--paper tgrid" id="what">
        <div className="shell">
          <Reveal as="div" className="sec-head">
            <Eyebrow home>{c.pillarsEyebrow}</Eyebrow>
            <h2>{c.pillarsH}</h2>
            <p className="lede"><Bidi text={c.pillarsLede} lang={c.lang} /></p>
          </Reveal>
          <div className="bento">
            {c.pillars.map((p, i) => (
              <Reveal
                as="article"
                key={p.h}
                delay={i}
                className={`tile ${i === 1 ? 'tile--dark' : ''}`.trim()}
              >
                <div className="tile__idx">{p.idx}</div>
                <div className="tile__ic"><Icon name={p.icon} /></div>
                <h3>{p.h}</h3>
                <p><Bidi text={p.p} lang={c.lang} /></p>
                <Tick items={p.li} />
                <TLink href={href(c.lang, p.link)}>{p.cta}</TLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* exclusive distribution */}
      <section className="sec" id="ega">
        <div className="shell">
          <Reveal as="div" className="excl grain">
            <div className="excl__in">
              <div>
                <Eyebrow home>{ex.eyebrow}</Eyebrow>
                <h2>{ex.h}</h2>
                <blockquote className="excl__quote"><Bidi text={ex.quote} lang={c.lang} /></blockquote>
                <p className="body" style={{ color: 'var(--steel-200)' }}>
                  <Bidi text={ex.p} lang={c.lang} />
                </p>
                <div className="excl__meta">
                  {ex.meta.map((m) => (
                    <div key={m.s}><b className="num" dir="ltr">{m.b}</b><span>{m.s}</span></div>
                  ))}
                </div>
                <div className="btn-row">
                  <Btn href={href(c.lang, 'ega-master')}>{ex.cta}</Btn>
                </div>
              </div>
              <div>
                <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: '1rem' }}>
                  <Photo
                    name="excl"
                    alt="Certified industrial tooling held in stock"
                    className="photo--4x3"
                    sizes="(max-width:900px) 90vw, 40vw"
                  />
                </div>
                <div className="certgrid">
                  {ex.certs.map((x) => <div key={x} dir="ltr">{x}</div>)}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <WellScroller c={c} />
      <Partners c={c} />
      <DroneSection c={c} />
      <LeadTime c={c} />
      <Coverage c={c} />
    </Shell>
  );
}
