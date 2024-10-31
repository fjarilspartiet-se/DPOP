# DPOP (Digital Party Operations Platform)

DPOP is a decentralized platform designed to support both political parties and social movements, enabling effective democratic operations in both online and offline environments. Initially developed for Unity Forward (Enhet Framåt) in Sweden, but designed to be universally applicable.

## Core Concepts

- **Flexible Organization**: Support for fluid, app-based political engagement with minimal formal structure
- **Spontaneous Engagement**: Tools for impromptu meetings, initiatives, and group formation
- **Cross-Platform Integration**: Seamless connection with various social platforms and communication tools
- **Dual Support**: Integrated support for both structured party operations and fluid movement activities
- **Natural Growth**: Inspired by butterfly metamorphosis stages for participant development
- **Inclusive Design**: Universal accessibility without special adaptations for different groups
- **Hybrid Operations**: Seamless integration of digital and physical activities

## Features (Planned)

### Core Platform
- Decentralized, P2P-based system
- Real-time party updates and voting
- Spontaneous meeting organization
- Cross-platform group management
- Resource sharing and coordination

### Engagement Support
- Simple proposal submission
- Flexible voting mechanisms
- Impromptu meeting tools
- Group formation support
- Multi-platform integration

### Technical Foundation
- Robust security framework
- Privacy-preserving design
- Offline-first architecture
- Cross-platform compatibility
- API-driven integration

### Shared Infrastructure
- Secure member management and communication
- Document management with offline support
- Event coordination and resource management

### Party-Specific Features
- Formal decision-making tools
- Committee management
- Campaign coordination
- Policy development support

### Movement-Specific Features
- Fluid participation support
- "Meadow" gathering coordination
- Initiative management
- Resource sharing platform

## Current Status

Early development - establishing core infrastructure and implementing initial features for both party and movement operations.

## Tech Stack

- Backend: Node.js with CosmicSyncCore
- Frontend: Next.js with TypeScript
- Database: PostgreSQL
- P2P: libp2p (via CosmicSyncCore)
- Testing: Jest

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BjornKennethHolmstrom/DPOP.git
   cd DPOP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`

5. Start development server:
   ```bash
   npm run dev
   ```

## Documentation

- `/docs/movement/` - Movement-specific documentation
- `/docs/party/` - Party-specific documentation
- `/docs/shared/` - Shared infrastructure documentation

Documentation is available in Swedish (primary) and English (translation).

## Files & Folder Tree

DPOP
├── config
├── coverage
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov.info
│   └── lcov-report
│       ├── base.css
│       ├── block-navigation.js
│       ├── favicon.png
│       ├── index.html
│       ├── lib
│       │   ├── db.ts.html
│       │   └── index.html
│       ├── prettify.css
│       ├── prettify.js
│       ├── sort-arrow-sprite.png
│       ├── sorter.js
│       └── utils
│           ├── format.ts.html
│           └── index.html
├── docs
│   ├── architecture
│   │   ├── core
│   │   │   ├── decisions
│   │   │   ├── diagrams
│   │   │   ├── dpop-architecture.md
│   │   │   ├── dpop-dual-architecture.md
│   │   │   └── dpop-mvp.md
│   │   ├── movement
│   │   └── party
│   ├── concepts
│   │   ├── movement
│   │   ├── party
│   │   │   ├── basis-for-unity.md
│   │   │   ├── foundation.md
│   │   │   └── initial-outline.md
│   │   └── shared
│   ├── dev
│   │   ├── guides
│   │   ├── journal
│   │   └── procedures
│   ├── movement
│   │   ├── sv
│   │   │   ├── äng
│   │   │   │   ├── aktiviteter.md
│   │   │   │   ├── ansökningsexempel.md
│   │   │   │   ├── ansökningsmallar.md
│   │   │   │   ├── organisationsguide.md
│   │   │   │   └── setup-checklist-sv.md
│   │   │   ├── mall.md
│   │   │   ├── organisation.md
│   │   │   └── stadier.md
│   │   └── translations
│   │       └── en
│   │           ├── core-concepts.md
│   │           ├── meadow
│   │           │   ├── activity-guide.md
│   │           │   ├── organization-guide.md
│   │           │   └── setup-checklist.md
│   │           └── stages.md
│   ├── planning
│   │   ├── development-plan.md
│   │   ├── modified-development-plan.md
│   │   └── phase0-detailed-plan.md
│   ├── specs
│   │   ├── api
│   │   ├── features
│   │   │   ├── digital-platform.md
│   │   │   ├── flexible-governance.md
│   │   │   └── platform-specification.md
│   │   ├── integration
│   │   │   ├── action-plans.md
│   │   │   └── swedish-integration.md
│   │   ├── movement
│   │   ├── operations
│   │   │   ├── communication-strategy.md
│   │   │   ├── education-framework.md
│   │   │   ├── ethics-framework.md
│   │   │   ├── financial-framework.md
│   │   │   ├── legal-framework.md
│   │   │   └── quality-assurance.md
│   │   └── security
│   │       ├── anti-corruption.md
│   │       └── security-framework.md
│   ├── strategy
│   │   ├── movement
│   │   ├── party
│   │   │   ├── international-strategy.md
│   │   │   ├── religious-diversity.md
│   │   │   └── research-development.md
│   │   └── shared
│   └── user
│       ├── faq
│       ├── guides
│       └── tutorials
├── jest.config.mjs
├── jest.setup.js
├── jest.setup.ts
├── LICENSE
├── next.config.mjs
├── package.json
├── package-lock.json
├── packages
│   ├── cli
│   └── sdk
├── prisma
│   ├── migrations
│   │   ├── 20241026165640_initial_core_schema
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   ├── seed.ts
│   └── tsconfig.json
├── public
│   ├── fonts
│   ├── images
│   └── locales
├── README.md
├── scripts
│   ├── deploy
│   ├── dev
│   └── setup
├── src
│   ├── core
│   │   ├── constants
│   │   ├── types
│   │   │   └── organization.ts
│   │   └── utils
│   ├── lib
│   │   └── db.ts
│   ├── models
│   ├── movement
│   │   ├── components
│   │   │   └── Navigation
│   │   │       └── MovementNav.tsx
│   │   ├── hooks
│   │   ├── services
│   │   │   └── index.ts
│   │   └── utils
│   ├── pages
│   │   ├── api
│   │   │   ├── movement
│   │   │   └── party
│   │   ├── index.tsx
│   │   ├── movement
│   │   └── party
│   ├── party
│   │   ├── components
│   │   │   └── Navigation
│   │   │       └── PartyNav.tsx
│   │   ├── hooks
│   │   ├── services
│   │   │   └── index.ts
│   │   └── utils
│   ├── shared
│   │   ├── components
│   │   │   └── Layout
│   │   │       └── DualModeLayout.tsx
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   └── utils
│   │       ├── format.test.ts
│   │       └── format.ts
│   └── styles
├── tests
│   ├── core
│   ├── movement
│   │   └── services
│   │       └── initiatives.test.ts
│   ├── party
│   │   └── services
│   │       └── voting.test.ts
│   ├── shared
│   │   ├── e2e
│   │   ├── fixtures
│   │   ├── integration
│   │   └── unit
│   │       └── Member.test.ts
│   └── utils
│       └── test-utils.tsx
├── tsconfig.json
└── types


## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the DPOP Democratic Software License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Claude 3.5 Sonnet for development assistance
- ChatGPT for technical support
