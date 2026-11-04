import { DocsPage } from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <DocsPage full breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
      <div className="kp-not-found">
        <h1>Page not found</h1>
        <p>This page doesn&apos;t exist or has moved. Search the docs, or start from the introduction.</p>
        <Link href="/introduction">Go to the introduction</Link>
      </div>
    </DocsPage>
  );
}
