import 'next-auth';
import { LifeStage, ButterflyRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      lifeStage: LifeStage;
      butterflyRole?: ButterflyRole | null;
    };
  }

  interface User {
    id: string;
    lifeStage?: LifeStage;
    butterflyRole?: ButterflyRole | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    lifeStage?: LifeStage;
    butterflyRole?: ButterflyRole | null;
  }
}
