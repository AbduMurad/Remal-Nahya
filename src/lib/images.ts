import MANIFEST from '@/content/images.json';
import { asset } from './links';

export type ImageName = keyof typeof MANIFEST;

export interface ImageEntry {
  w: number; h: number; ratio: string; jpg: string;
  srcs: { f: string; w: number; kb: number }[];
  lqip: string; inline: string; inlineKb: number;
}

export const img = (name: ImageName): ImageEntry => MANIFEST[name] as ImageEntry;

export const srcSet = (e: ImageEntry) =>
  e.srcs.map((s) => `${asset(`/assets/img/${s.f}`)} ${s.w}w`).join(', ');

export const fallback = (e: ImageEntry) => asset(`/assets/img/${e.jpg}`);
