// src/types/meadow.ts

import { MeadowType, MeadowStatus } from '@prisma/client';

export interface MeadowActivity {
  id: string;
  type: 'join' | 'leave' | 'message' | 'contribution';
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
}

export interface MeadowHost {
  id: string;
  name: string;
  stage: string;
}

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
  activities: MeadowActivity[];
  host: MeadowHost;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMeadowInput {
  name: string;
  description: string;
  type: MeadowType;
  status: MeadowStatus;
  location: string;
  dateTime?: string;
  maxParticipants?: number;
}

export interface UpdateMeadowInput extends Partial<CreateMeadowInput> {
  id: string;
}
