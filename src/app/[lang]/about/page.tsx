import { PageHead, Coverage } from '@/components/sections/common';
import { Eyebrow, Photo, Bidi } from '@/components/ui';
import { Reveal } from '@/components/ui/client';
import { Icon } from '@/components/svg/Icon';
import { Shell, metaFor, resolve, type PageProps } from '@/lib/page';

export const generateMetadata = metaFor('about');

export default async function About({ params }: PageProps) {
  const c = await resolve(params);
  const w = c.aboutWho;
  return (
    <Shell c={c} page="about">
      <PageHead c={c} page="about" image="ph-about" h={c.aboutHead.h} lede={c.aboutHead.lede} />

      <section className="sec">
        <div className="shell">
          <div className="split split--60" style={{ alignItems: 'center' }}>
            <Reveal as="div">
              <Eyebrow>{w.eyebrow}</Eyebrow>
              <h2>{w.h}</h2>
              <p className="lede" style={{ marginBlockStart: '1.25rem' }}><Bidi text={w.p1} lang={c.lang} /></p>
              <p className="body" style={{ marginBlockStart: '1.1rem' }}><Bidi text={w.p2} lang={c.lang} /></p>
              <p className="body" style={{ marginBlockStart: '1.1rem' }}><Bidi text={w.p3} lang={c.lang} /></p>
            </Reveal>
            <Reveal as="div" delay={1} style={{ borderRadius: 10, overflow: 'hidden' }}>
              <Photo name="crew" alt="Field operations at dusk" className="photo--4x3"
                sizes="(max-width:900px) 90vw, 42vw" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec sec--paper tgrid">
        <div className="shell">
          <div className="bento">
            {c.aboutMv.map((x, i) => (
              <Reveal as="article" key={x.k} delay={i}
                className={`tile tile--6 ${i === 0 ? 'tile--dark' : 'tile--crimson'}`}>
                <div className="tile__ic"><Icon name={i === 0 ? 'globe' : 'spark'} /></div>
                <h3>{x.k}</h3>
                <p><Bidi text={x.v} lang={c.lang} /></p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--dark">
        <div className="shell">
          <Reveal as="div" className="sec-head">
            <Eyebrow>{c.ui.values}</Eyebrow>
            <h2>{c.aboutValsH}</h2>
          </Reveal>
          <div className="vals">
            {c.aboutVals.map((v, i) => (
              <Reveal as="article" className="val" delay={i} key={v.h}>
                <div className="val__n">{v.n}</div>
                <h3>{v.h}</h3>
                <p><Bidi text={v.p} lang={c.lang} /></p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--paper">
        <div className="shell">
          <div className="split" style={{ alignItems: 'start' }}>
            <Reveal as="div">
              <Eyebrow>{c.ui.process}</Eyebrow>
              <h2>{c.aboutTlH}</h2>
              <p className="lede" style={{ marginBlockStart: '1.25rem' }}>
                <Bidi text={c.aboutTlLede} lang={c.lang} />
              </p>
              <div style={{ borderRadius: 10, overflow: 'hidden', marginTop: '2rem' }}>
                <Photo name="stock" alt="Industrial stock held on racking" className="photo--4x3"
                  sizes="(max-width:900px) 90vw, 42vw" />
              </div>
            </Reveal>
            <Reveal as="ul" className="tl" delay={1}>
              {c.aboutTl.map((t) => (
                <li key={t.h}>
                  <b>{t.b}</b>
                  <h3>{t.h}</h3>
                  <p><Bidi text={t.p} lang={c.lang} /></p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <Coverage c={c} />
    </Shell>
  );
}
