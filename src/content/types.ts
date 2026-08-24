export const LANGS = ['en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

export const PAGES = [
  'index',
  'services',
  'ega-master',
  'well-services',
  'about',
  'contact',
] as const;
export type Page = (typeof PAGES)[number];

/** Slug for a page. `index` is the language root. */
export const SLUG: Record<Page, string> = {
  index: '',
  services: 'services',
  'ega-master': 'ega-master',
  'well-services': 'well-services',
  about: 'about',
  contact: 'contact',
};

export type IconName =
  | 'tools' | 'cart' | 'well' | 'shield' | 'drone' | 'gauge' | 'truck' | 'flask'
  | 'drill' | 'layers' | 'cert' | 'clock' | 'phone' | 'mail' | 'pin' | 'globe'
  | 'arrow' | 'spark' | 'link' | 'download' | 'search' | 'check' | 'ruler'
  | 'menu' | 'close' | 'home' | 'bolt' | 'caliper' | 'torque' | 'box';

export type ServiceCat = 'tools' | 'procurement' | 'wells' | 'drone';

export interface Stat {
  n: number;
  group: boolean;   // thousands separators
  post: string;     // suffix rendered after the number, e.g. '+' or ' psi'
  label: string;
}

export interface Pillar {
  idx: string;
  icon: IconName;
  h: string;
  p: string;
  li: string[];
  link: Page;
  cta: string;
}

export interface WellStep {
  stage: 'cementing' | 'stimulation' | 'completion' | 'intervention';
  n: string;
  h: string;
  p: string;
  spec: string;
  by: string;
}

export interface Partner {
  n: string;
  h: string;
  c: string;
  p: string;
  tags: string[];
}

export interface ToolCat {
  h: string;
  p: string;
  tag: string;
}

export interface Value { n: string; h: string; p: string }
export interface LeadRow { k: string; v: string; d: string; tag: string }
export interface TimelineStep { b: string; h: string; p: string }
export interface Desk { b: string; s: string }

/** One service, written in both languages. */
export interface ServiceCopy {
  h: string;
  p: string;
  specs: string[];
  by: string;
}
export interface Service {
  cat: ServiceCat;
  icon: IconName;
  en: ServiceCopy;
  ar: ServiceCopy;
}

export interface Copy {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  other: Lang;
  otherLabel: string;
  brand: string;
  brandFull: string;

  nav: Record<Page, string>;
  /** Bottom-bar labels — deliberately shorter than `nav`, a tab is ~70px wide. */
  tabs: Record<Exclude<Page, 'about'>, string>;
  ctaNav: string;

  titles: Record<Page, string>;
  descs: Record<Page, string>;
  depots: string[];

  hero: { badge: string; h1a: string; h1b: string; h1c: string; lede: string; cta1: string; cta2: string };
  stats: Stat[];
  ticker: string[];

  pillarsEyebrow: string;
  pillarsH: string;
  pillarsLede: string;
  pillars: Pillar[];

  excl: {
    eyebrow: string; h: string; quote: string; p: string;
    meta: { b: string; s: string }[]; certs: string[]; cta: string;
  };

  wellSec: { eyebrow: string; h: string; lede: string; cta: string };
  wellSteps: WellStep[];

  partners: { eyebrow: string; h: string; lede: string };
  partnerList: Partner[];

  drone: { eyebrow: string; h: string; lede: string; li: string[]; cta: string; by: string };
  map: { eyebrow: string; h: string; lede: string; li: string[]; cta: string };
  ctaBand: { h: string; p: string; b1: string; b2: string };

  servicesHead: { h: string; lede: string };
  filterLabels: Record<'all' | ServiceCat, string>;
  searchPh: string;
  noResult: string;

  egaHead: { h: string; lede: string };
  egaRisk: { eyebrow: string; h: string; p: string; li: string[] };
  egaCats: ToolCat[];
  egaStatsH: string;
  egaStats: Stat[];
  egaCta: { h: string; p: string; b1: string; b2: string };

  lead: { eyebrow: string; h: string; lede: string; rows: LeadRow[] };

  wsHead: { h: string; lede: string };
  wsAppsH: string;
  wsApps: string[];

  aboutHead: { h: string; lede: string };
  aboutWho: { eyebrow: string; h: string; p1: string; p2: string; p3: string };
  aboutMv: { k: string; v: string }[];
  aboutValsH: string;
  aboutVals: Value[];
  aboutTlH: string;
  aboutTlLede: string;
  aboutTl: TimelineStep[];

  contactHead: { h: string; lede: string };
  desksH: string;
  desks: Desk[];
  desksNote: string;
  contactRowsH: string;
  formH: string;
  formLede: string;
  form: {
    name: string; company: string; email: string; phone: string;
    dept: string; msg: string; msgPh: string; submit: string; ok: string; note: string;
    file: string; file_hint: string; ph_name: string; ph_co: string;
  };
  formDepts: string[];

  foot: { about: string; c1: string; c2: string; c3: string; legal: string; built: string };
  footServices: [Page, string][];
  skip: string;

  /** small shared strings */
  ui: {
    deliveredWith: string; address: string; telephone: string; email: string; website: string;
    menu: string; close: string; mainNav: string; primaryNav: string;
    toolCats: string; supplyServices: string; supplyServicesH: string; certifiedTo: string;
    catalogue: string; catalogueH: string; applications: string; values: string;
    process: string; whoWeAre: string; routing: string; enquiry: string;
  };
}
