// src/core/types/organization.ts
export type OrganizationType = 'party' | 'movement' | 'hybrid';

interface BaseConfig {
  name: string;
  type: OrganizationType;
  features: string[];
}

export interface PartyConfig extends BaseConfig {
  committees: string[];
  votingRules: VotingRules;
}

export interface MovementConfig extends BaseConfig {
  initiatives: string[];
  stages: StageConfig[];
}
