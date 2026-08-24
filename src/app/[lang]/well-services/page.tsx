import { PageHead, Partners, DroneSection } from '@/components/sections/common';
import { ServiceCatalogue } from '@/components/sections/ServiceCatalogue';
import { WellScroller } from '@/components/sections/WellScroller';
import { Eyebrow, Photo, Tick } from '@/components/ui';
import { Reveal } from '@/components/ui/client';
import { Shell, metaFor, resolve, type PageProps } from '@/lib/page';

export const generateMetadata = metaFor('well-services');

export default async function Wells({ params }: PageProps) {
  const c = await resolve(params);
  return (
    <Shell c={c} page="well-services">
      <PageHead c={c} page="well-services" image="ph-well" h={c.wsHead.h} lede={c.wsHead.lede} />
      <WellScroller c={c} />

      <section className="sec">
        <div className="shell">
          <Reveal as="div" className="sec-head">
            <Eyebrow>{c.ui.catalogue}</Eyebrow>
            <h2>{c.ui.catalogueH}</h2>
          </Reveal>
          <ServiceCatalogue c={c} cats={['all', 'wells', 'drone']} only={['wells', 'drone']} />
        </div>
      </section>

      <section className="sec sec--dark">
        <div className="shell">
          <div className="split" style={{ alignItems: 'center' }}>
            <Reveal as="div">
              <Eyebrow>{c.ui.applications}</Eyebrow>
              <h2>{c.wsAppsH}</h2>
              <div style={{ marginBlockStart: '1.75rem' }}><Tick items={c.wsApps} /></div>
            </Reveal>
            <Reveal as="div" delay={1} style={{ borderRadius: 10, overflow: 'hidden' }}>
              <Photo name="plant" alt="Refinery process plant" className="photo--16x9"
                sizes="(max-width:900px) 90vw, 45vw" />
            </Reveal>
          </div>
        </div>
      </section>

      <Partners c={c} />
      <DroneSection c={c} />
    </Shell>
  );
}
