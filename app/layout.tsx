import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { siteName, siteUrl } from '@/lib/site';
import './global.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} Docs`, template: `%s - ${siteName}` },
  description: 'Developer documentation for the Kulmi Pay payments API.',
  icons: { icon: '/favicon.png' },
  openGraph: { siteName, type: 'website', images: '/logo.png' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
