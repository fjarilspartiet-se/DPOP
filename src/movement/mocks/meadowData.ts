// src/movement/mocks/meadowData.ts

import { MeadowType, MeadowStatus, LifeStage } from '@prisma/client';
import type { Meadow } from '@/movement/types/meadow';

export const mockMeadows: Meadow[] = [
  {
    id: '1',
    name: 'Hållbar framtid workshop',
    description: 'En workshop om hållbara lösningar och lokala initiativ för en bättre framtid.',
    type: MeadowType.WORKSHOP,
    status: MeadowStatus.ACTIVE,
    location: 'Kulturhuset, Stockholm',
    dateTime: new Date('2024-12-01T14:00:00'),
    maxParticipants: 30,
    currentParticipants: 12,
    host: {
      id: 'host1',
      name: 'Maria Andersson',
    },
    participants: [
      {
        id: 'host1',
        name: 'Maria Andersson',
        stage: LifeStage.BUTTERFLY,
        role: 'HOST',
        joinedAt: new Date('2024-11-15T10:00:00'),
      },
      {
        id: 'participant1',
        name: 'Erik Johansson',
        stage: LifeStage.LARVAE,
        role: 'PARTICIPANT',
        joinedAt: new Date('2024-11-16T14:30:00'),
      },
      {
        id: 'participant2',
        name: 'Anna Lindberg',
        stage: LifeStage.PUPA,
        role: 'PARTICIPANT',
        joinedAt: new Date('2024-11-16T15:45:00'),
      }
    ],
    activities: [
      {
        id: 'activity1',
        type: 'join',
        userName: 'Erik Johansson',
        timestamp: new Date('2024-11-16T14:30:00'),
      },
      {
        id: 'activity2',
        type: 'message',
        userName: 'Maria Andersson',
        details: 'Välkomna alla! Ser fram emot en spännande workshop.',
        timestamp: new Date('2024-11-16T15:00:00'),
      },
      {
        id: 'activity3',
        type: 'join',
        userName: 'Anna Lindberg',
        timestamp: new Date('2024-11-16T15:45:00'),
      }
    ],
    createdAt: new Date('2024-11-15T10:00:00'),
    updatedAt: new Date('2024-11-16T15:45:00'),
  },
  {
    id: '2',
    name: 'Digital demokrati diskussion',
    description: 'En öppen diskussion om hur vi kan använda teknik för att stärka demokratin.',
    type: MeadowType.DISCUSSION,
    status: MeadowStatus.PLANNED,
    location: 'Online via Zoom',
    dateTime: new Date('2024-12-05T18:00:00'),
    maxParticipants: 50,
    currentParticipants: 8,
    host: {
      id: 'host2',
      name: 'Johan Berg',
    },
    participants: [
      {
        id: 'host2',
        name: 'Johan Berg',
        stage: LifeStage.BUTTERFLY,
        role: 'HOST',
        joinedAt: new Date('2024-11-16T09:00:00'),
      }
    ],
    activities: [
      {
        id: 'activity4',
        type: 'message',
        userName: 'Johan Berg',
        details: 'Alla är välkomna att delta i denna viktiga diskussion om demokratins framtid!',
        timestamp: new Date('2024-11-16T09:15:00'),
      }
    ],
    createdAt: new Date('2024-11-16T09:00:00'),
    updatedAt: new Date('2024-11-16T09:15:00'),
  }
];
