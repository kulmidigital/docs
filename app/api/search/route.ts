import { createFromSource } from 'fumadocs-core/search/server';
import { isListed } from '@/lib/nav';
import { source } from '@/lib/source';

export const { GET } = createFromSource({
  ...source,
  getPages: () => source.getPages().filter(isListed),
});
