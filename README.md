# DPOP (Digital Party Operations Platform)

DPOP is a decentralized platform designed to enable democratic organizations to operate effectively in both online and offline environments.

## Current Status

Early development - setting up project infrastructure.

## Features (Planned)

- Decentralized, P2P-based platform
- Secure member management and communication
- Democratic decision-making tools
- Document management with offline support
- Event coordination and resource management
- Flexible governance model support

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
   git clone https://github.com/username/dpop.git
   cd dpop
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

## Files & Folder Tree

.
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
│   │   │   ├── dpop-architecture.md
│   │   │   └── dpop-mvp.md
│   │   ├── decisions
│   │   └── diagrams
│   ├── concepts
│   │   ├── ethics
│   │   ├── governance
│   │   ├── party
│   │   │   ├── basis-for-unity.md
│   │   │   ├── foundation.md
│   │   │   └── initial-outline.md
│   │   └── strategy
│   │       ├── international-strategy.md
│   │       ├── religious-diversity.md
│   │       └── research-development.md
│   ├── dev
│   │   ├── guides
│   │   ├── journal
│   │   └── procedures
│   ├── planning
│   │   ├── development-plan.md
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
│   ├── api
│   ├── components
│   ├── lib
│   │   └── db.ts
│   ├── models
│   ├── pages
│   │   └── index.tsx
│   ├── services
│   ├── styles
│   └── utils
│       ├── format.test.ts
│       └── format.ts
├── tests
│   ├── e2e
│   ├── fixtures
│   ├── integration
│   ├── unit
│   │   └── Member.test.ts
│   └── utils
│       └── test-utils.tsx
└── tsconfig.json

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the DPOP Democratic Software License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Claude 3.5 Sonnet for development assistance
- ChatGPT for technical support
