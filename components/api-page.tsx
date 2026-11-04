'use client';

import { createOpenAPIPage } from 'fumadocs-openapi/ui';
import {
  type CodeUsageGenerator,
  createCodeUsageGeneratorRegistry,
} from 'fumadocs-openapi/requests/generators';
import { curl } from 'fumadocs-openapi/requests/generators/curl';
import { go } from 'fumadocs-openapi/requests/generators/go';
import { java } from 'fumadocs-openapi/requests/generators/java';
import { javascript } from 'fumadocs-openapi/requests/generators/javascript';
import { python } from 'fumadocs-openapi/requests/generators/python';
import { phpCodeSample } from './php-code-sample';

/**
 * Samples always show the auth header, as on Mintlify. Fumadocs leaves it out
 * until the "Try it" panel has opened, and leaves the token empty after that.
 * Every operation in openapi.yml uses the global secret key.
 */
const withAuthHeader = (generator: CodeUsageGenerator): CodeUsageGenerator => ({
  ...generator,
  generate(data, context) {
    const auth = data.header.Authorization;
    if (auth && auth.value !== 'Bearer ') return generator.generate(data, context);

    return generator.generate(
      { ...data, header: { ...data.header, Authorization: { value: 'Bearer <token>' } } },
      context,
    );
  },
});

const codeUsages = createCodeUsageGeneratorRegistry();
const php: CodeUsageGenerator = { label: 'PHP', lang: 'php', generate: phpCodeSample };

// Same languages and order as Mintlify. Fumadocs has no PHP sample of its own.
for (const [id, generator] of Object.entries({ curl, python, js: javascript, php, go, java })) {
  codeUsages.add(id, withAuthHeader(generator));
}

type SchemeWithDefault = { type: string; 'x-default'?: string };

export const APIPage = createOpenAPIPage({
  codeUsages,
  playground: {
    // Prefill the sample keys from `x-default` in openapi.yml, as Mintlify did.
    transformAuthInputs: (fields) =>
      fields.map((field) => {
        const { type, 'x-default': sample } = field.scheme as SchemeWithDefault;
        if (!sample) return field;
        return { ...field, defaultValue: type === 'http' ? `Bearer ${sample}` : sample };
      }),
  },
});
