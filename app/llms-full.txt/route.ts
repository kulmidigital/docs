import { isListed } from '@/lib/nav';
import { docsLlms, source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = await Promise.all(source.getPages().filter(isListed).map(docsLlms.page));

  return new Response(pages.join('\n\n'));
}
