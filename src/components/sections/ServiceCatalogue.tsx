'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/svg/Icon';
import { SERVICES } from '@/content/services';
import type { Copy, Service, ServiceCat } from '@/content/types';

type Filter = 'all' | ServiceCat;

export function ServiceCard({ c, s }: { c: Copy; s: Service }) {
  const d = c.lang === 'ar' ? s.ar : s.en;
  return (
    <article className="srv" data-cat={s.cat}>
      <div className="srv__ic"><Icon name={s.icon} /></div>
      <div>
        <h3>{d.h}</h3>
        <p>{d.p}</p>
        <div className="srv__specs">
          {d.specs.map((x) => <span key={x} dir="ltr">{x}</span>)}
        </div>
        {d.by && <div className="srv__by">{c.ui.deliveredWith} {d.by}</div>}
      </div>
    </article>
  );
}

/**
 * Filter chips plus a free-text search over the whole catalogue. Rendered on the
 * client because the state is interactive, but every card is in the initial HTML
 * — so the full catalogue is indexable and readable with JavaScript disabled.
 */
export function ServiceCatalogue({
  c, cats = ['all', 'tools', 'procurement', 'wells', 'drone'], only,
}: {
  c: Copy; cats?: Filter[]; only?: ServiceCat[];
}) {
  const pool = useMemo(
    () => (only ? SERVICES.filter((s) => only.includes(s.cat)) : SERVICES),
    [only],
  );
  const [cat, setCat] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return pool.filter((s) => {
      if (cat !== 'all' && s.cat !== cat) return false;
      if (!needle) return true;
      const d = c.lang === 'ar' ? s.ar : s.en;
      const hay = `${d.h} ${d.p} ${d.specs.join(' ')} ${d.by}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [pool, cat, q, c.lang]);

  return (
    <>
      <div className="filters" id="srvfilter">
        {cats.map((k) => (
          <button
            key={k}
            className="chip"
            data-filter={k}
            aria-pressed={cat === k}
            onClick={() => setCat(k)}
          >
            {c.filterLabels[k]}
          </button>
        ))}
        <div className="searchbox">
          <Icon name="search" />
          <input
            type="search"
            placeholder={c.searchPh}
            aria-label={c.searchPh}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="srvgrid">
        {shown.map((s) => <ServiceCard key={s.en.h} c={c} s={s} />)}
      </div>

      {shown.length === 0 && <div className="noresult" id="noresult">{c.noResult}</div>}
    </>
  );
}
