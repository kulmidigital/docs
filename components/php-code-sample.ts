import type { CodeUsageGenerator } from 'fumadocs-openapi/requests/generators';

type RequestSample = Parameters<CodeUsageGenerator['generate']>[0];

const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export function phpCodeSample({ url, method, header, body, bodyMediaType }: RequestSample): string {
  const headers = Object.entries(header).map(([name, { value }]) => `${name}: ${String(value)}`);
  if (body && bodyMediaType) headers.push(`Content-Type: ${bodyMediaType}`);

  const options = [
    `CURLOPT_URL => ${quote(url)}`,
    'CURLOPT_RETURNTRANSFER => true',
    `CURLOPT_CUSTOMREQUEST => ${quote(method.toUpperCase())}`,
  ];
  if (headers.length > 0) {
    options.push(`CURLOPT_HTTPHEADER => [\n    ${headers.map(quote).join(',\n    ')},\n  ]`);
  }
  if (body && bodyMediaType) {
    options.push(`CURLOPT_POSTFIELDS => ${quote(JSON.stringify(body, null, 2))}`);
  }

  return `<?php

$curl = curl_init();

curl_setopt_array($curl, [
  ${options.join(',\n  ')},
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`;
}
