import { siteName, siteUrl } from '@/lib/site';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const index = await docsLlms.index();

  return new Response(
    index
      .replace(/^# .*/, `# ${siteName}`)
      .replace(/\]\(\/([^)]*)\)/g, (_, path: string) => `](${siteUrl}/${path}.md)`),
  );
}
