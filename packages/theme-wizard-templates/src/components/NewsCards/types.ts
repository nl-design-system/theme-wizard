import type { ImageMetadata } from 'astro';

export interface NewsItem {
  body: string;
  date: string;
  dateTime: string;
  href: string;
  image?: {
    alt: string;
    focalPoint?: string;
    src: ImageMetadata | string;
  };
  title: string;
}
