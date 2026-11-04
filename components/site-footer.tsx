import { socials, siteName, websiteUrl } from '@/lib/site';

const links = [
  {
    label: 'X',
    href: socials.x,
    path: 'M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.5 22H3.4l7.3-8.3L1 2h6.3l4.3 5.7L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z',
  },
  {
    label: 'LinkedIn',
    href: socials.linkedin,
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.05 3.78-2.05 4.05 0 4.8 2.66 4.8 6.13V21h-4v-4.99c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4V9.75Z',
  },
];

export function SiteFooter() {
  return (
    <footer className="kp-footer">
      <a href={websiteUrl} className="kp-footer-name">
        {siteName}
      </a>
      <div className="kp-footer-links">
        {links.map((link) => (
          <a key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d={link.path} />
            </svg>
          </a>
        ))}
      </div>
    </footer>
  );
}
