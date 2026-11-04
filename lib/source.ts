import { llms, loader, multiple, type LoaderPlugin } from 'fumadocs-core/source';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { openapiPlugin, type OpenAPIPageData } from 'fumadocs-openapi/server';
import { defineDocs } from 'fumadocs-mdx/macro';
import { z } from 'zod';
import { openapi, slugify } from './openapi';
import { renderOperationMarkdown } from './openapi-markdown';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({ sidebarTitle: z.string().optional() }),
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: { schema: metaSchema },
});

const apiReference = await openapi.staticSource({
  per: 'custom',
  baseDir: 'api-reference',
  toPages(builder) {
    for (const item of builder.extract().operations) {
      const op = builder.fromExtractedOperation(item);
      if (!op) continue;

      const title = op.displayName;
      builder.create({
        type: 'operation',
        schemaId: builder.id,
        path: `${slugify(item.tags?.[0] ?? 'other')}/${slugify(title)}.mdx`,
        info: { title, description: op.operation.description },
        item,
      });
    }
  },
});

/** Mintlify's `sidebarTitle` frontmatter. */
const sidebarTitlePlugin: LoaderPlugin = {
  name: 'kulmipay:sidebar-title',
  transformPageTree: {
    file(node, filePath) {
      const file = filePath ? this.storage.read(filePath) : undefined;
      const title =
        file?.format === 'page' ? (file.data as { sidebarTitle?: string }).sidebarTitle : undefined;
      if (title) node.name = title;
      return node;
    },
  },
};

export const source = loader({
  baseUrl: '/',
  source: multiple({
    docs: docs.toFumadocsSource(),
    openapi: apiReference,
  }),
  plugins: [sidebarTitlePlugin, openapiPlugin()],
});

export type SourcePage = ReturnType<typeof source.getPages>[number];
export type OpenAPISourcePage = SourcePage & { data: OpenAPIPageData & { type: 'openapi' } };

export function isOpenAPIPage(page: SourcePage): page is OpenAPISourcePage {
  return page.data.type === 'openapi';
}

export const docsLlms = llms(source, {
  renderPage: async (page) => {
    if (isOpenAPIPage(page)) return renderOperationMarkdown(page);

    return `# ${page.data.title} (${page.url})

${page.data.description ?? ''}

${await page.data.getText('processed')}`;
  },
});
