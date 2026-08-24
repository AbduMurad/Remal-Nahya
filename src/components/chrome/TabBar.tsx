import Link from 'next/link';
import { Icon } from '@/components/svg/Icon';
import { href } from '@/lib/links';
import type { Copy, IconName, Page } from '@/content/types';

/**
 * Bottom navigation for phones and small tablets (≤900px).
 *
 * Five destinations, the last of them the conversion action. Contact is marked
 * by a filled crimson disc rather than crimson text: crimson on navy is 2.33:1
 * and would fail contrast in the one place people tap most.
 *
 * About is the only page not here — the least-visited on a B2B site — and the
 * burger drawer still carries all six.
 */
const TABS: [Exclude<Page, 'about'>, IconName][] = [
  ['index', 'home'],
  ['services', 'layers'],
  ['ega-master', 'tools'],
  ['well-services', 'well'],
  ['contact', 'mail'],
];

export function TabBar({ c, page }: { c: Copy; page: Page }) {
  return (
    <nav className="tabbar" aria-label={c.ui.primaryNav}>
      <div className="tabbar__in">
        {TABS.map(([p, icon]) => (
          <Link
            key={p}
            href={href(c.lang, p)}
            className={p === 'contact' ? 'is-cta' : undefined}
            aria-current={p === page ? 'page' : undefined} prefetch={false}>
            <span className="tabbar__ic"><Icon name={icon} /></span>
            <span className="tabbar__l">{c.tabs[p]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
