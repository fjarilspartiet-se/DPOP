# DPOP (Digital Party Operations Platform)

DPOP is a decentralized platform designed to support both political parties and social movements, enabling effective democratic operations in both online and offline environments. Initially developed for Unity Forward (Enhet Framåt) in Sweden, but designed to be universally applicable.

## Core Concepts

- **Dual Support**: Integrated support for both structured party operations and fluid movement activities
- **Natural Growth**: Inspired by butterfly metamorphosis stages for participant development
- **Inclusive Design**: Universal accessibility without special adaptations for different groups
- **Hybrid Operations**: Seamless integration of digital and physical activities

## Features (Planned)

### Shared Infrastructure
- Decentralized, P2P-based platform
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

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the DPOP Democratic Software License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Claude 3.5 Sonnet for development assistance
- ChatGPT for technical support
