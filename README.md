# DPOP (Digital Party Operations Platform)

DPOP is a decentralized platform designed to support both political parties and social movements, enabling effective democratic operations in both online and offline environments. Initially developed for Fjärilspartiet in Sweden, but designed to be universally applicable.

## Core Concepts

- **Flexible Organization**: Support for fluid, app-based political engagement with minimal formal structure
- **Spontaneous Engagement**: Tools for impromptu meetings, initiatives, and group formation
- **Cross-Platform Integration**: Seamless connection with various social platforms and communication tools
- **Dual Support**: Integrated support for both structured party operations and fluid movement activities
- **Natural Growth**: Inspired by butterfly metamorphosis stages for participant development
- **Inclusive Design**: Universal accessibility without special adaptations for different groups
- **Hybrid Operations**: Seamless integration of digital and physical activities

## Latest Updates (v0.3.4)

### New Features
- Resource category management system
- Category hierarchy support
- Enhanced resource filtering

### Core Features
- Authentication system with social login support
- Multi-language support (Swedish/English)
- Dark/Light theme
- Life stage progression system
- Welcome meadow onboarding
- Journey tracking system
- Achievement system
- Voting system
- Resource categories

## Development Status

### Completed
✅ Authentication system
✅ Language switching
✅ Theme support
✅ Basic navigation
✅ Welcome meadow
✅ Meadow management interface
✅ Journey tracking system
✅ Achievement notifications
✅ Voting system
✅ Resource category management

### In Progress
🚧 Real-time updates
🚧 Initiative management
🚧 Resource sharing
🚧 Community features


### Planned
📋 Initiative management
📋 Community features
📋 Journey tracking
📋 Resource sharing

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

4. Configure your environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dpop?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   ```

5. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

6. Start development server:
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
│   ├── middleware
│   │   └── error.ts
│   ├── models
│   ├── movement
│   │   ├── components
│   │   │   ├── Journey
│   │   │   │   ├── AchievementNotificationManager.tsx
│   │   │   │   ├── AchievementNotification.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── JourneyDashboard.tsx
│   │   │   │   └── StageProgressionTracker.tsx
│   │   │   ├── Meadow
│   │   │   │   ├── index.ts
│   │   │   │   ├── MeadowActivityDisplay.tsx
│   │   │   │   ├── MeadowDetail.tsx
│   │   │   │   ├── MeadowForm.tsx
│   │   │   │   ├── MeadowManager.tsx
│   │   │   │   ├── MeadowParticipants.tsx
│   │   │   │   ├── MeadowsPage.tsx
│   │   │   │   └── MeadowStatusDisplay.tsx
│   │   │   └── Navigation
│   │   │       └── MovementNav.tsx
│   │   ├── hooks
│   │   │   ├── useAchievements.ts
│   │   │   ├── useJourney.ts
│   │   │   ├── useMeadows.ts
│   │   │   └── useStageProgression.ts
│   │   ├── mocks
│   │   │   └── meadowData.ts
│   │   ├── services
│   │   │   └── index.ts
│   │   ├── types
│   │   │   └── meadow.ts
│   │   └── utils
│   ├── pages
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth].ts
│   │   │   │   └── register.ts
│   │   │   ├── movement
│   │   │   │   ├── achievements
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── seen.ts
│   │   │   │   │   └── new.ts
│   │   │   │   ├── meadows
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   ├── complete.ts
│   │   │   │   │   │   ├── join.ts
│   │   │   │   │   │   └── leave.ts
│   │   │   │   │   ├── [id].ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── resources
│   │   │   │       ├── [id]
│   │   │   │       │   └── share.ts
│   │   │   │       ├── [id].ts
│   │   │   │       └── index.ts
│   │   │   ├── party
│   │   │   └── upload.ts
│   │   ├── _app.tsx
│   │   ├── auth
│   │   │   ├── register.tsx
│   │   │   └── signin.tsx
│   │   ├── index.tsx
│   │   ├── movement
│   │   │   ├── meadows
│   │   │   │   └── index.tsx
│   │   │   └── resources
│   │   │       └── index.tsx
│   │   └── party
│   ├── party
│   │   ├── components
│   │   │   └── Navigation
│   │   │       └── PartyNav.tsx
│   │   ├── hooks
│   │   ├── services
│   │   │   └── index.ts
│   │   └── utils
│   ├── services
│   │   ├── achievementHandlers.ts
│   │   ├── achievementService.ts
│   │   ├── achievementTriggers.ts
│   │   ├── fileUploadService.ts
│   │   ├── meadowService.ts
│   │   ├── resourceService.ts
│   │   └── stageService.ts
│   ├── shared
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Alert.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── Panel.tsx
│   │   │   │   └── PasswordStrengthMeter.tsx
│   │   │   ├── Layout
│   │   │   │   └── DualModeLayout.tsx
│   │   │   ├── Movement
│   │   │   │   ├── Dashboard
│   │   │   │   │   ├── CommunityPanel.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── InitiativesPanel.tsx
│   │   │   │   │   ├── JourneyPanel.tsx
│   │   │   │   │   ├── MeadowsPanel.tsx
│   │   │   │   │   ├── ResourcesPanel.tsx
│   │   │   │   │   └── StatsOverview.tsx
│   │   │   │   ├── MovementDashboard.tsx
│   │   │   │   ├── Resources
│   │   │   │   │   ├── ResourceCreationFormContent.tsx
│   │   │   │   │   ├── ResourceCreationForm.tsx
│   │   │   │   │   └── ResourceLibrary.tsx
│   │   │   │   └── WelcomeMeadow.tsx
│   │   │   └── Party
│   │   │       ├── Dashboard
│   │   │       │   ├── ActiveVotes.tsx
│   │   │       │   ├── AlertsPanel.tsx
│   │   │       │   ├── EventsPanel.tsx
│   │   │       │   ├── index.tsx
│   │   │       │   ├── ProposalsPanel.tsx
│   │   │       │   └── StatsOverview.tsx
│   │   │       └── PartyDashboard.tsx
│   │   ├── context
│   │   ├── hooks
│   │   │   └── useAuth.ts
│   │   ├── layouts
│   │   └── utils
│   │       ├── format.test.ts
│   │       ├── format.ts
│   │       └── password.ts
│   ├── styles
│   │   └── globals.css
│   └── types
│       └── meadow.ts
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
