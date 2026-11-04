import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { layoutTree } from '@/lib/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { nav, ...options } = baseOptions();

  return (
    <DocsLayout
      {...options}
      tree={layoutTree}
      tabMode="navbar"
      nav={{ ...nav, mode: 'top' }}
    >
      {children}
    </DocsLayout>
  );
}
