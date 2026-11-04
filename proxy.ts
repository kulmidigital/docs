import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { type NextRequest, NextResponse } from 'next/server';

// Keeps Mintlify's Markdown URLs: `/quickstart.md`, or any page with
// `Accept: text/markdown`.
const { rewrite: rewriteAccept } = rewritePath('{/*path}', '/llms.mdx{/*path}/content.md');
const { rewrite: rewriteSuffix } = rewritePath('{/*path}.md', '/llms.mdx{/*path}/content.md');

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const suffixed = rewriteSuffix(pathname);
  if (suffixed) return NextResponse.rewrite(new URL(suffixed, request.nextUrl));

  if (isMarkdownPreferred(request)) {
    const rewritten = rewriteAccept(pathname);
    if (rewritten) {
      return NextResponse.rewrite(new URL(rewritten, request.nextUrl), {
        headers: { Vary: 'Accept' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|api/|llms|postman/|logo\\.png|favicon\\.png|robots\\.txt|sitemap\\.xml).*)'],
};
