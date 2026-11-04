import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { signUpUrl, siteName, websiteUrl } from './site';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Image src="/logo.png" alt={siteName} width={744} height={335} priority className="h-8 w-auto" />,
      url: websiteUrl,
    },
    links: [
      { text: 'Website', url: websiteUrl, external: true },
      {
        type: 'custom',
        secondary: true,
        children: (
          <a href={signUpUrl} className="kp-signup">
            Sign Up
          </a>
        ),
      },
    ],
  };
}
