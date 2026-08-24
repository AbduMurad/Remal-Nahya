import { PageHead, StatBand } from '@/components/sections/common';
import { ServiceCatalogue } from '@/components/sections/ServiceCatalogue';
import { Btn, Eyebrow, Photo, Tick, Bidi } from '@/components/ui';
import { Reveal } from '@/components/ui/client';
import { href } from '@/lib/links';
import { Shell, metaFor, resolve, type PageProps } from '@/lib/page';

export const generateMetadata = metaFor('ega-master');

const TOOL_IMAGES = ['tool-a', 'tool-b', 'tool-c', 'tool-d', 'tool-e', 'tool-f'] as const;

export default async function Ega({ params }: PageProps) {
  const c = await resolve(params);
  const r = c.egaRisk;
  return (
    <Shell c={c} page="ega-master">
      <PageHead c={c} page="ega-master" image="ph-ega" h={c.egaHead.h} lede={c.egaHead.lede} />

      <section className="sec sec--dark">
        <div className="shell">
          <div className="split split--60" style={{ alignItems: 'center' }}>
            <Reveal as="div">
              <Eyebrow>{r.eyebrow}</Eyebrow>
              <h2>{r.h}</h2>
              <p className="lede" style={{ marginBlockStart: '1.25rem' }}>
                <Bidi text={r.p} lang={c.lang} />
              </p>
              <Tick items={r.li} />
            </Reveal>
            <Reveal as="div" delay={1} style={{ borderRadius: 10, overflow: 'hidden' }}>
              <Photo
                name="hse"
                alt="A safety helmet hanging in an industrial plant"
                className="photo--4x3"
                sizes="(max-width:900px) 90vw, 42vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <StatBand stats={c.egaStats} />

      <section className="sec sec--paper tgrid">
        <div className="shell">
          <Reveal as="div" className="sec-head">
            <Eyebrow>{c.ui.toolCats}</Eyebrow>
            <h2>{c.egaStatsH}</h2>
          </Reveal>
          <div className="srvgrid">
            {c.egaCats.map((t, i) => (
              <Reveal as="article" className="toolcard" delay={i % 3} key={t.h}>
                <Photo
                  name={TOOL_IMAGES[i % TOOL_IMAGES.length]}
                  alt={t.h}
                  className="photo--sq"
                  sizes="(max-width:900px) 45vw, 22vw"
                />
                <h3>{t.h}</h3>
                <p><Bidi text={t.p} lang={c.lang} /></p>
                <span className="toolcard__tag" dir={c.lang === 'ar' ? undefined : 'ltr'}>{t.tag}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="shell">
          <Reveal as="div" className="sec-head">
            <Eyebrow>{c.ui.supplyServices}</Eyebrow>
            <h2>{c.ui.supplyServicesH}</h2>
          </Reveal>
          <ServiceCatalogue c={c} cats={['all', 'tools']} only={['tools']} />
        </div>
      </section>

      <section className="sec sec--darkest">
        <div className="shell">
          <div className="split" style={{ alignItems: 'center' }}>
            <Reveal as="div">
              <Eyebrow>{c.excl.eyebrow}</Eyebrow>
              <h2>{c.egaCta.h}</h2>
              <blockquote className="excl__quote"><Bidi text={c.excl.quote} lang={c.lang} /></blockquote>
              <p className="body" style={{ color: 'var(--steel-200)' }}>
                <Bidi text={c.egaCta.p} lang={c.lang} />
              </p>
              <div className="btn-row"><Btn href={href(c.lang, 'contact')}>{c.egaCta.b1}</Btn></div>
            </Reveal>
            <Reveal as="div" delay={1}>
              <h3 style={{ color: '#fff', marginBottom: '1.25rem', fontSize: 'var(--step-1)' }}>
                {c.ui.certifiedTo}
              </h3>
              <div className="certgrid">
                {c.excl.certs.map((x) => <div key={x} dir="ltr">{x}</div>)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Shell>
  );
}
