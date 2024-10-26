// tests/utils/test-utils.tsx

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Mocked Prisma Client
export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

// Custom render function
const render = (ui: React.ReactElement, { ...options } = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// Testing Database utilities
export const createTestDatabase = async () => {
  const prisma = new PrismaClient();
  
  // Clean up database before tests
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }

  await prisma.$disconnect();
};

// Re-export everything
export * from '@testing-library/react';
export { render };
