import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Every page keeps its Mintlify URL. These only cover URLs that never held a
// page of their own, so they are temporary, as they were on Mintlify.
const redirects = [
  // Mintlify's own redirects
  ['/index', '/'],
  ['/collections', '/collections/overview'],
  ['/send-money', '/send-money/introduction'],
  ['/wallets', '/wallets/introduction'],
  ['/webhooks', '/webhooks/overview'],
  ['/refunds', '/refunds/creating-a-refund'],
  ['/sms-customization', '/sms-customization/introduction'],
  ['/mpesa-paybill', '/mpesa-paybill/introduction'],
  ['/api-reference', '/api-reference/collections/collect-payment'],
  ['/api-reference/collections', '/api-reference/collections/collect-payment'],
  ['/api-reference/wallet-as-a-service', '/api-reference/wallet-as-a-service/list-wallets'],
  [
    '/api-reference/bring-your-m-pesa-tillpaybill-number',
    '/api-reference/bring-your-m-pesa-tillpaybill-number/list-m-pesa-accounts',
  ],
  // Linked from API error messages and the dashboard, 404 on Mintlify
  ['/sandbox-and-live-environments', '/sandbox'],
  ['/docs/wallets', '/wallets/introduction'],
  ['/docs/payment-button', '/collections/checkout'],
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // lib/source.ts reads the spec when a server function starts. Next can't see
  // that read, so it would otherwise leave the file out of the deployed bundle.
  outputFileTracingIncludes: { '/**': ['./openapi.yml'] },
  async redirects() {
    return redirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
};

export default withMDX(config);
