import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: ['./openapi.yml'],
  proxyUrl: '/api/proxy',
});

/** Mintlify's slug rule. Keeps `/api-reference/<tag>/<summary>` URLs unchanged. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
