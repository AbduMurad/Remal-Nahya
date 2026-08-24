import type { IconName } from '@/content/types';


/* 24px stroke icons. `data-flip` marks the directional ones, which the
   stylesheet mirrors under [dir="rtl"]. */

const PATHS: Record<IconName, React.ReactNode> = {
  'tools': <><path d="M15.5 3.5a4.5 4.5 0 0 0-1.1 4.6L5.6 16.8a2 2 0 1 0 2.8 2.8l8.7-8.8a4.5 4.5 0 0 0 5.4-5.9l-2.6 2.6-2.5-.7-.7-2.5Z"/><path d="M6.8 18.2h.01"/></>,
  'cart': <><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/></>,
  'well': <><path d="m5.5 21 6.5-18 6.5 18"/><path d="M8 13h8M9.2 9.5h5.6M12 3v18"/></>,
  'shield': <><path d="M12 2 20 5.5v6C20 17 16.5 20.5 12 22 7.5 20.5 4 17 4 11.5v-6Z"/><path d="m9 12 2 2 4-4"/></>,
  'drone': <><rect x="9" y="9" width="6" height="6" rx="1.5"/><path d="M9 9 5.5 5.5M15 9l3.5-3.5M9 15l-3.5 3.5M15 15l3.5 3.5"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/></>,
  'gauge': <><path d="M12 14 16 9"/><circle cx="12" cy="14" r="1"/><path d="M4 18a9 9 0 1 1 16 0"/></>,
  'truck': <><path d="M2 6h11v11H2Z"/><path d="M13 9h4l4 4v4h-8Z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></>,
  'flask': <><path d="M9 2v6.6L4.2 18A2 2 0 0 0 6 21h12a2 2 0 0 0 1.8-3L15 8.6V2"/><path d="M8 2h8M7.5 14h9"/></>,
  'drill': <><rect x="3" y="5" width="10" height="7" rx="1.5"/><path d="M13 7h4.5L21 9.5 17.5 12H13"/><path d="M6.5 12v4.5M6.5 19.5v.01M10 12v2.5"/></>,
  'layers': <><path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/></>,
  'cert': <><path d="M6 3h12v13l-6 3-6-3Z"/><path d="m9 9 2 2 4-4"/><path d="M9 21h6"/></>,
  'clock': <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></>,
  'phone': <><path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></>,
  'mail': <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  'pin': <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></>,
  'globe': <><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/></>,
  'arrow': <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  'spark': <><path d="M13 2 4 14h7l-1 8 9-12h-7Z"/></>,
  'link': <><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></>,
  'download': <><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></>,
  'search': <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  'check': <><path d="m4 12 5 5L20 6"/></>,
  'ruler': <><path d="M2.5 16.5 16.5 2.5l5 5-14 14Z"/><path d="m6 13 2 2M9 10l2 2M12 7l2 2"/></>,
  'bolt': <><path d="M12 2a5 5 0 0 0-5 5v3H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h-2V7a5 5 0 0 0-5-5Z"/><path d="M9.5 10V7a2.5 2.5 0 0 1 5 0v3"/><path d="M12 14v3"/></>,
  'caliper': <><path d="M4 3h5v18H4z"/><path d="M15 3h5v13l-2.5 5-2.5-5Z"/><path d="M9 7h6M9 11h6M9 15h6"/></>,
  'torque': <><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8 19 19M19 5l-2.2 2.2M7.2 16.8 5 19"/></>,
  'box': <><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2Z"/><path d="m4 7.2 8 4.2 8-4.2M12 11.4V21"/></>,
  'home': <><path d="M3.5 10.2 12 3.5l8.5 6.7V20a1 1 0 0 1-1 1h-4.5v-6h-6v6H4.5a1 1 0 0 1-1-1Z"/></>,
  'menu': <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  'close': <><path d="M6 6l12 12M18 6 6 18"/></>,
};


const FLIP = new Set<IconName>(['arrow']);

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `ic ${className}` : 'ic'}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden
      {...(FLIP.has(name) ? { 'data-flip': '' } : {})}
    >
      {PATHS[name]}
    </svg>
  );
}
