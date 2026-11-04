import type * as PageTree from 'fumadocs-core/page-tree';
import { source, type SourcePage } from './source';

interface Listed {
  item: PageTree.Item;
  group?: string;
}

function collect(nodes: PageTree.Node[], out: Listed[] = [], parentGroup?: string): Listed[] {
  let group = parentGroup;
  for (const node of nodes) {
    if (node.type === 'separator') group = String(node.name ?? '');
    else if (node.type === 'page') out.push({ item: node, group });
    else collect(node.children, out, group);
  }
  return out;
}

const tree = source.getPageTree();
const tabs = tree.children.flatMap((node) => (node.type === 'folder' ? [collect(node.children)] : []));
const listed = new Map(tabs.flat().map((entry) => [entry.item.url, entry]));

const isApiUrl = (url: string) => url.startsWith('/api-reference/');

/**
 * Pages in the sidebar, plus the home page. As on Mintlify, other pages keep
 * working by URL but stay out of search and the sitemap.
 */
export function isListed(page: Pick<SourcePage, 'url'>): boolean {
  return page.url === '/' || listed.has(page.url);
}

/** The sidebar group a page sits in, shown above its title. */
export function getGroup(url: string): string | undefined {
  return listed.get(url)?.group;
}

/** Previous and next links, which skip pages that aren't in the sidebar. */
export function getNeighbours(url: string) {
  const tab = tabs.find((pages) => pages.some((entry) => entry.item.url === url));
  const index = tab?.findIndex((entry) => entry.item.url === url) ?? -1;
  if (!tab || index === -1) return {};

  return { previous: tab[index - 1]?.item, next: tab[index + 1]?.item };
}

/**
 * The tree the layout renders. Fumadocs only knows which tab a page belongs to
 * if the page is in that tab's tree, so unlisted pages are added to it and hidden
 * with CSS (`.kp-unlisted`). That keeps the right tab and sidebar on those pages.
 */
export const layoutTree: PageTree.Root = {
  ...tree,
  fallback: undefined,
  children: tree.children.map((node) => {
    if (node.type !== 'folder') return node;

    const isApiTab = node.children.some((child) => child.type === 'page' && isApiUrl(child.url));
    const unlisted = source
      .getPages()
      .filter((page) => !listed.has(page.url) && isApiUrl(page.url) === isApiTab)
      .map(
        (page): PageTree.Item => ({
          type: 'page',
          name: <span className="kp-unlisted">{page.data.title}</span>,
          url: page.url,
        }),
      );

    return { ...node, children: [...node.children, ...unlisted] };
  }),
};
