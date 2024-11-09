import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import prisma from '@/lib/db';
import { MeadowType, MeadowStatus } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user, default meadow, and participant in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
        },
      });

      // Create or find the welcome meadow
      const welcomeMeadow = await tx.meadow.upsert({
        where: { name: 'Welcome Meadow' }, // We'll keep the English name as the identifier
        update: {},
        create: {
          name: 'Welcome Meadow',
          description: 'Welcome to our community! This is where your transformation journey begins.',
          status: MeadowStatus.ACTIVE,
          type: MeadowType.GATHERING,
        },
      });

      // Create meadow participant
      await tx.meadowParticipant.create({
        data: {
          userId: newUser.id,
          meadowId: welcomeMeadow.id,
          lifeStage: LifeStage.EGG,
          nickname: name,
        },
      });

      return newUser;
    });

    // Return success without sensitive data
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
