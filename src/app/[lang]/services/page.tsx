import { PageHead, Coverage, LeadTime } from '@/components/sections/common';
import { ServiceCatalogue } from '@/components/sections/ServiceCatalogue';
import { WellScroller } from '@/components/sections/WellScroller';
import { Shell, metaFor, resolve, type PageProps } from '@/lib/page';

export const generateMetadata = metaFor('services');

export default async function Services({ params }: PageProps) {
  const c = await resolve(params);
  return (
    <Shell c={c} page="services">
      <PageHead c={c} page="services" image="ph-services" h={c.servicesHead.h} lede={c.servicesHead.lede} />
      <section className="sec sec--paper">
        <div className="shell"><ServiceCatalogue c={c} /></div>
      </section>
      <LeadTime c={c} />
      <WellScroller c={c} />
      <Coverage c={c} />
    </Shell>
  );
}
