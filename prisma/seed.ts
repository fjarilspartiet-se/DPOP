// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import pkg from 'bcryptjs';
const { hash } = pkg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.member.upsert({
      where: { email: 'admin@dpop.dev' },
      update: {},
      create: {
        email: 'admin@dpop.dev',
        name: 'Admin User',
        passwordHash: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create test member
    const memberPassword = await hash('member123', 12);
    const member = await prisma.member.upsert({
      where: { email: 'member@dpop.dev' },
      update: {},
      create: {
        email: 'member@dpop.dev',
        name: 'Test Member',
        passwordHash: memberPassword,
        role: 'MEMBER',
      },
    });

    // Create test proposal
    const proposal = await prisma.proposal.create({
      data: {
        title: 'Test Proposal',
        description: 'This is a test proposal for development purposes.',
        status: 'VOTING',
      },
    });

    // Create test vote
    await prisma.vote.create({
      data: {
        memberId: member.id,
        proposalId: proposal.id,
        choice: 'YES',
      },
    });

    console.log('Seed data created:', { admin, member, proposal });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
