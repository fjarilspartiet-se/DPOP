// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import pkg from 'bcryptjs';
const { hash } = pkg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { seedCategories } from './seeds/categories.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@dpop.dev' },
      update: {},
      create: {
        email: 'admin@dpop.dev',
        name: 'Admin User',
        passwordHash: adminPassword,
        currentStage: 'BUTTERFLY',
      },
    });

    // Create test user
    const memberPassword = await hash('member123', 12);
    const member = await prisma.user.upsert({
      where: { email: 'member@dpop.dev' },
      update: {},
      create: {
        email: 'member@dpop.dev',
        name: 'Test Member',
        passwordHash: memberPassword,
        currentStage: 'EGG',
      },
    });

    // Create test proposal
    const proposal = await prisma.proposal.create({
      data: {
        title: 'Test Proposal',
        description: 'This is a test proposal for development purposes.',
        status: 'draft',
        voteStatus: 'DRAFT',
        authorId: admin.id,
        content: {},
      },
    });

    // Create test vote
    await prisma.vote.create({
      data: {
        userId: member.id,
        proposalId: proposal.id,
        choice: { vote: true },
      },
    });

    // Seed resource categories
    await seedCategories();

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
