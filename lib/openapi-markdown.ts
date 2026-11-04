import { dump } from 'js-yaml';
import type { OpenAPIPageData } from 'fumadocs-openapi/server';

type Page = { url: string; data: OpenAPIPageData };

function collectRefs(value: unknown, doc: Record<string, unknown>, found: Set<string>) {
  if (Array.isArray(value)) {
    for (const item of value) collectRefs(item, doc, found);
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === '$ref' && typeof child === 'string' && !found.has(child)) {
        found.add(child);
        collectRefs(resolve(child, doc), doc, found);
      } else {
        collectRefs(child, doc, found);
      }
    }
  }
}

function resolve(ref: string, doc: Record<string, unknown>): unknown {
  return ref
    .replace(/^#\//, '')
    .split('/')
    .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], doc);
}

/** The `.md` version of an API page: the operation plus only the schemas it uses. */
export function renderOperationMarkdown(page: Page): string {
  const { bundled } = page.data.getSchema();
  const doc = bundled as unknown as Record<string, unknown>;
  const { operations = [] } = page.data.getOpenAPIPageProps();
  const paths = doc.paths as Record<string, Record<string, unknown>>;

  const slice: Record<string, Record<string, unknown>> = {};
  for (const { path, method } of operations) {
    slice[path] = { ...slice[path], [method]: paths[path]?.[method] };
  }

  const refs = new Set<string>();
  collectRefs(slice, doc, refs);

  const components: Record<string, Record<string, unknown>> = {};
  for (const ref of refs) {
    const [, group, name] = ref.replace(/^#\//, '').split('/');
    if (group && name) components[group] = { ...components[group], [name]: resolve(ref, doc) };
  }
  const allComponents = doc.components as Record<string, unknown> | undefined;
  if (allComponents?.securitySchemes) {
    components.securitySchemes = allComponents.securitySchemes as Record<string, unknown>;
  }

  const yaml = dump(
    { openapi: doc.openapi, servers: doc.servers, paths: slice, components },
    { noRefs: true, lineWidth: 100 },
  );

  return `# ${page.data.title} (${page.url})

${page.data.description ?? ''}

## OpenAPI

\`\`\`\`yaml
${yaml}\`\`\`\`
`;
}
