import { openapi } from '@/lib/openapi';

// The API reference's "try it" panel calls the API through this route to avoid
// CORS. It can only reach the KulmiPay API.
export const { GET, HEAD, POST, PUT, PATCH, DELETE } = openapi.createProxy({
  allowedOrigins: ['https://sandbox.kulmipay.com', 'https://app.kulmipay.com'],
});
