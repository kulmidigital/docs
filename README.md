# KulmiPay developer docs

The site at [developers.kulmipay.com](https://developers.kulmipay.com), built with [Fumadocs](https://fumadocs.dev) on Next.js.

## Run it locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## Where things live

| Path | What it is |
|---|---|
| `content/docs/(guide)/` | The Documentation tab. Folders in brackets don't appear in the URL. |
| `content/docs/(guide)/meta.json` | Documentation sidebar: order, group names, which pages show |
| `openapi.yml` | The API spec. The API Reference pages are generated from it at build time. |
| `content/docs/api-reference/meta.json` | API Reference sidebar |
| `content/docs/api-reference/*.mdx` | Hand-written API pages. They work by URL but aren't in the sidebar. |
| `components/mintlify.tsx` | `Card`, `CardGroup`, `Steps`, `ParamField`, `ResponseField`, `Expandable` |
| `app/global.css` | Brand colours and component styles |
| `next.config.mjs` | Redirects |

## Add a page

1. Add an `.mdx` file under `content/docs/(guide)/`, with `title` and `description` in the frontmatter. `sidebarTitle` is optional.
2. Add it to `content/docs/(guide)/meta.json`, or it won't show in the sidebar, search or sitemap.

For a new API endpoint, add it to `openapi.yml` with a `summary` and one tag, then add it to `content/docs/api-reference/meta.json` as `<tag>/<summary>` in lower-case with hyphens.

## Writing components

- Callouts: `<Callout type="info">`, `"warn"` or `"idea"`
- Code tabs: add `tab="Name"` to neighbouring code fences, as in ` ```bash tab="cURL" `
- Code title: ` ```json title="Response" `

## Before merging

```bash
npm run build
npm run types:check
npm start
```

With the server running, in a second terminal:

```bash
npm run check:links -- http://localhost:3000
```

This crawls every page for broken links and anchors, and checks every URL in `scripts/mintlify-urls.json` still works.
