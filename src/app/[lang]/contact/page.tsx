import { PageHead, Coverage } from '@/components/sections/common';
import { ContactForm } from '@/components/sections/ContactForm';
import { Eyebrow, Bidi } from '@/components/ui';
import { Reveal } from '@/components/ui/client';
import { Icon } from '@/components/svg/Icon';
import { FACTS, tel } from '@/content/facts';
import { Shell, metaFor, resolve, type PageProps } from '@/lib/page';

export const generateMetadata = metaFor('contact');

export default async function Contact({ params }: PageProps) {
  const c = await resolve(params);
  return (
    <Shell c={c} page="contact">
      <PageHead c={c} page="contact" image="ph-contact" h={c.contactHead.h} lede={c.contactHead.lede} />

      <section className="sec sec--darkest">
        <div className="shell">
          <div className="split split--40" style={{ alignItems: 'start' }}>
            <div>
              <Reveal as="div">
                <Eyebrow>{c.ui.routing}</Eyebrow>
                <h2 style={{ fontSize: 'var(--step-3)' }}>{c.desksH}</h2>
              </Reveal>

              <div className="desks" style={{ marginTop: '2rem' }}>
                {c.desks.map((d, i) => (
                  <Reveal as="div" className="desk" delay={i} key={d.s}>
                    <b>{d.b}</b>
                    <span className="ltr" dir="ltr">{d.s}</span>
                  </Reveal>
                ))}
              </div>
              <p className="formnote">{c.desksNote}</p>

              <h3 style={{ color: '#fff', margin: '2.75rem 0 .5rem', fontSize: 'var(--step-1)' }}>
                {c.contactRowsH}
              </h3>

              <div className="crow">
                <div className="crow__ic"><Icon name="pin" /></div>
                <div>
                  <b>{c.ui.address}</b>
                  <span>{c.lang === 'ar' ? FACTS.addressAr : FACTS.addressEn}</span>
                </div>
              </div>
              <div className="crow">
                <div className="crow__ic"><Icon name="phone" /></div>
                <div>
                  <b>{c.ui.telephone}</b>
                  <a href={tel(FACTS.phone1)} className="ltr" dir="ltr">{FACTS.phone1}</a>
                  <a href={tel(FACTS.phone2)} className="ltr" dir="ltr">{FACTS.phone2}</a>
                </div>
              </div>
              <div className="crow">
                <div className="crow__ic"><Icon name="mail" /></div>
                <div>
                  <b>{c.ui.email}</b>
                  <a href={`mailto:${FACTS.email}`} className="ltr" dir="ltr">{FACTS.email}</a>
                </div>
              </div>
              <div className="crow">
                <div className="crow__ic"><Icon name="globe" /></div>
                <div>
                  <b>{c.ui.website}</b>
                  <a href={`https://${FACTS.site}`} className="ltr" dir="ltr">{FACTS.site}</a>
                </div>
              </div>
            </div>

            <Reveal as="div" delay={1}>
              <Eyebrow>{c.ui.enquiry}</Eyebrow>
              <h2 style={{ fontSize: 'var(--step-3)' }}>{c.formH}</h2>
              <p className="lede" style={{ margin: '1rem 0 2rem' }}>
                <Bidi text={c.formLede} lang={c.lang} />
              </p>
              <ContactForm c={c} />
            </Reveal>
          </div>
        </div>
      </section>

      <Coverage c={c} />
    </Shell>
  );
}
