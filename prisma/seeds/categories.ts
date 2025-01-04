// prisma/seeds/categories.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialCategories = [
  {
    name: 'Guider & Manualer',
    description: 'Instruktioner och vägledning för olika aspekter av rörelsen',
    children: [
      {
        name: 'Ängssamlingar',
        description: 'Guider för att organisera och facilitera ängssamlingar'
      },
      {
        name: 'Digital demokrati',
        description: 'Guider för användning av digitala demokrativerktyg'
      }
    ]
  },
  {
    name: 'Mallar & Verktyg',
    description: 'Återanvändbara mallar och praktiska verktyg',
    children: [
      {
        name: 'Projektplanering',
        description: 'Mallar för att planera och strukturera initiativ'
      },
      {
        name: 'Mötesmallar',
        description: 'Mallar för olika typer av möten och samlingar'
      }
    ]
  },
  {
    name: 'Utbildningsmaterial',
    description: 'Resurser för lärande och utveckling',
    children: [
      {
        name: 'Grundkurser',
        description: 'Introduktionskurser för nya medlemmar'
      },
      {
        name: 'Fördjupningar',
        description: 'Avancerat material för djupare förståelse'
      }
    ]
  }
];

async function seedCategories() {
  console.log('Seeding resource categories...');

  for (const category of initialCategories) {
    const parent = await prisma.resourceCategory.create({
      data: {
        name: category.name,
        description: category.description,
        createdBy: 'system'  // You might want to change this to an admin user ID
      }
    });

    if (category.children) {
      for (const child of category.children) {
        await prisma.resourceCategory.create({
          data: {
            name: child.name,
            description: child.description,
            parentId: parent.id,
            createdBy: 'system'
          }
        });
      }
    }
  }

  console.log('Resource categories seeded successfully!');
}

export { seedCategories };
