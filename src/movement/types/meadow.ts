// src/movement/types/meadow.ts

import { MeadowStatus, MeadowType, LifeStage } from '@prisma/client';

export interface Meadow {
  id: string;
  name: string;
  description: string;
  type: MeadowType;
  status: MeadowStatus;
  location: string;
  dateTime?: Date;
  maxParticipants?: number;
  currentParticipants: number;
  host: {
    id: string;
    name: string;
  };
  participants: Array<{
    id: string;
    name: string;
    stage: LifeStage;
    role: 'HOST' | 'PARTICIPANT';
    joinedAt: Date;
  }>;
  activities: MeadowActivity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeadowActivity {
  id: string;
  type: 'join' | 'leave' | 'message' | 'contribution';
  userName: string;
  details?: string;
  timestamp: Date;
}
