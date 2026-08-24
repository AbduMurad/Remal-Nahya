'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade-and-rise on entry. `delay` staggers siblings.
 *
 * The fail-safe matters: if the observer never fires — a browser quirk, a
 * layout that never intersects — the content must not stay invisible. Anything
 * still hidden after 3.2s is shown regardless.
 */
export function Reveal({
  children, delay = 0, as: As = 'div', className, ...rest
}: {
  children: ReactNode; delay?: number; as?: 'div' | 'section' | 'article' | 'li' | 'ul';
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !('IntersectionObserver' in window)) { setShown(true); return; }

    const timer = window.setTimeout(() => setShown(true), 3200);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => setShown(true), delay * 70);
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [delay]);

  const Tag = As as React.ElementType;
  return (
    <Tag ref={ref} className={className} data-rv={delay} data-in={shown ? 'true' : undefined} {...rest}>
      {children}
    </Tag>
  );
}

/** Counts up once on entry, then never again. */
export function Counter({
  value, group, post,
}: { value: number; group: boolean; post: string }) {
  const fmt = (n: number) =>
    (group ? Math.round(n).toLocaleString('en-US') : String(Math.round(n))) + post;
  const ref = useRef<HTMLElement>(null);
  const [text, setText] = useState(() => fmt(value));   // SSR renders the final value

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !('IntersectionObserver' in window)) return;
    setText(fmt(0));
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const DUR = 950;
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / DUR, 1);
        setText(fmt(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, group, post]);

  return <b ref={ref} dir="ltr">{text}</b>;
}

/** Reading-progress rule and the header's shade change. One listener for both. */
export function ChromeEffects() {
  useEffect(() => {
    const bar = document.getElementById('prog');
    const hdr = document.querySelector<HTMLElement>('.hdr');
    let ticking = false;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.inlineSize = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
      if (hdr) hdr.style.background = window.scrollY > 40 ? 'rgba(11,21,51,.985)' : 'rgba(11,21,51,.92)';
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="prog" id="prog" />;
}
