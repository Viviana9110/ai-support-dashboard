import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    globals: false,
    env: {
      AUTH_SECRET: 'test-auth-secret-at-least-32-bytes-for-hs256',
      ALLOW_PUBLIC_REGISTRATION: 'true',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
