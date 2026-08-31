import 'dotenv/config';

import { prisma } from '../src/lib/db';
import {
  AdminCredentialsError,
  createInitialAdmin,
  resolveAdminCredentials,
} from '../src/lib/create-admin';

import type { AdminEnv } from '../src/lib/create-admin';

async function main(): Promise<void> {
  const credentials = resolveAdminCredentials(
    process.env as AdminEnv,
  );

  const result = await createInitialAdmin(
    credentials.email,
    credentials.password,
  );

  if (result.status === 'created') {
    console.log(
      `[create-admin] ADMIN user created for ${result.email}.`,
    );
  } else {
    console.log(
      `[create-admin] ADMIN user already exists for ${result.email}; nothing changed.`,
    );
  }
}

main()
  .catch((error: unknown) => {
    if (error instanceof AdminCredentialsError) {
      console.error(`[create-admin] ${error.message}`);
    } else {
      console.error(
        '[create-admin] Failed to create the administrator user.',
      );

      if (error instanceof Error) {
        console.error(`[create-admin] ${error.message}`);
      }
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });