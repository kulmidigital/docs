import type { MetadataRoute } from 'next';
import { isListed } from '@/lib/nav';
import { siteUrl } from '@/lib/site';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  return source
    .getPages()
    .filter(isListed)
    .map((page) => ({ url: new URL(page.url, siteUrl).toString() }));
}
