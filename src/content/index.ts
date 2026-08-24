import { EN } from './en';
import { AR } from './ar';
import type { Copy, Lang } from './types';

export const COPY: Record<Lang, Copy> = { en: EN, ar: AR };
export const getCopy = (lang: Lang): Copy => COPY[lang];

export * from './types';
export { SERVICES } from './services';
export { FACTS, tel } from './facts';
