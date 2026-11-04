# Documentation project instructions

## About this project

- A documentation site built with Fumadocs on Next.js. See `README.md` for the layout.
- Pages are MDX files with YAML frontmatter in `content/docs/`.
- Sidebars are the `meta.json` files. API Reference pages are generated from `openapi.yml`.
- Run `npm run dev` to preview, and `npm run check:links` against a running server to check links.
- Existing URLs must keep working: API error messages and dashboards link to them.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise, one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
