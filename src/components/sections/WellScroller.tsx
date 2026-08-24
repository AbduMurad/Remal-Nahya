'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/svg/Icon';
import { Wellbore } from '@/components/svg/Diagrams';
import { href } from '@/lib/links';
import type { Copy, WellStep } from '@/content/types';

/**
 * The wellbore cross-section pins while the four service stages scroll past it,
 * and the diagram highlights whichever stage is in the middle of the viewport.
 * Hovering a step selects it too, for anyone using a pointer.
 */
export function WellScroller({ c, withHead = true }: { c: Copy; withHead?: boolean }) {
  const steps: WellStep[] = c.wellSteps;
  const [active, setActive] = useState(steps[0].stage);
  const [drawn, setDrawn] = useState(false);
  const svgWrap = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) { setDrawn(true); return; }

    const el = svgWrap.current;
    if (el) {
      const io = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) { setDrawn(true); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(el);
      return () => io.disconnect();
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          const s = (en.target as HTMLElement).dataset.stage as WellStep['stage'];
          if (s) setActive(s);
        }
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    stepRefs.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="sec wellsec tgrid" id="lifecycle">
      <div className="shell">
        {withHead && (
          <div className="sec-head">
            <div className="eyebrow">{c.wellSec.eyebrow.replace(/^\d{2}\s*[—-]\s*/, '')}</div>
            <h2>{c.wellSec.h}</h2>
            <p className="lede">{c.wellSec.lede}</p>
          </div>
        )}

        <div className="wellwrap" id="wellwrap">
          <div className="wellstick" ref={svgWrap} data-active={active} data-drawn={drawn ? 'true' : 'false'}>
            <Wellbore />
          </div>

          <div className="wellsteps">
            {steps.map((s, i) => (
              <article
                key={s.stage}
                ref={(n) => { stepRefs.current[i] = n; }}
                className="wstep"
                data-stage={s.stage}
                data-on={active === s.stage ? 'true' : 'false'}
                onMouseEnter={() => setActive(s.stage)}
              >
                <div className="wstep__n"><i />{s.n}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                <div>
                  <span className="wstep__spec"><Icon name="gauge" />{s.spec}</span>
                </div>
                <div className="srv__by" style={{ marginTop: '.9rem' }}>
                  {c.ui.deliveredWith} {s.by}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="btn-row">
          <Link className="btn btn--line" href={href(c.lang, 'well-services')} prefetch={false}>
            {c.wellSec.cta}<Icon name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
