import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { APIPage } from '@/components/api-page';
import { getMDXComponents } from '@/components/mdx';
import { SiteFooter } from '@/components/site-footer';
import { getGroup, getNeighbours } from '@/lib/nav';
import { siteName } from '@/lib/site';
import { isOpenAPIPage, source, type SourcePage } from '@/lib/source';

type Props = { params: Promise<{ slug?: string[] }> };

function Heading({ page }: { page: SourcePage }) {
  const group = getGroup(page.url);

  return (
    <>
      {group ? <p className="kp-eyebrow">{group}</p> : null}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
    </>
  );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const footer = { items: getNeighbours(page.url), children: <SiteFooter /> };

  if (isOpenAPIPage(page)) {
    return (
      <DocsPage full toc={page.data.toc} breadcrumb={{ enabled: false }} footer={footer}>
        <Heading page={page} />
        <DocsBody>
          <APIPage {...page.data.getOpenAPIPageProps()} showTitle={false} showDescription={false} />
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }} footer={footer}>
      <Heading page={page} />
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const title = page.data.title ?? siteName;

  return {
    title: page.url === '/' ? { absolute: title } : title,
    description: page.data.description,
    alternates: { canonical: page.url },
  };
}
