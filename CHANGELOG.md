# Changelog

All notable changes to this project will be documented in this file.

## [0.3.5] - 2025-01-18

### Added
- Real-time messaging system with WebSocket support
  - New WebSocket service for handling real-time communication
  - WebSocket server implementation with keep-alive mechanism
  - Message typing indicators and read receipts
  - Support for file attachments in messages
- Community components
  - MemberDirectory: Browse and interact with community members
  - MessageComposer: Rich text editor for composing messages with attachments
  - MessageList: Overview of conversations with real-time updates
  - MessageThread: Detailed conversation view with real-time messaging
- Improved user experience
  - Real-time achievement notifications
  - Live activity updates in MovementDashboard
  - Typing indicators in chat
  - Message read receipts
  - Offline message queuing and retry
### Enhanced
- MovementDashboard now includes real-time activity updates
- AchievementNotificationManager now uses WebSocket for instant notifications
### Technical
- Added WebSocket service with automatic reconnection
- Implemented keep-alive mechanism for stable connections
- Added TypeScript interfaces for WebSocket messages
- Improved error handling for network issues

## [0.3.4] - 2025-01-04

### Added
- Resource category management system
- Category hierarchy with parent-child relationships
- Category filtering for resources
- Database migrations for resource categories
- Initial category seeding system
- Comprehensive API endpoints for category operations
- Updated resource service with category support

### Changed
- Enhanced resource queries to support categories
- Improved resource creation and update operations
- Updated database schema with category relationships
- Modified resource API endpoints for category handling

## [0.3.3] - 2024-12-21

### Added
- Voting system

## [0.3.2] - 2024-11-30

### Added
- Journey tracking system with achievement notifications
- Stage progression visualization and management
- Achievement system with real-time notifications
- Complete meadow service implementation
- Comprehensive API endpoints for meadow operations
- Journey component system with stage tracking

### Changed
- Enhanced meadow service with complete CRUD operations
- Improved stage progression logic with requirements
- Updated component organization for Journey features
- Enhanced API structure for achievements

### Fixed
- Meadow service method inconsistencies
- API endpoint completion and standardization
- Component organization in Journey module
- Service method documentation

## [0.3.1] - 2024-11-16

### Added
- Core meadow management functionality
- Meadow activity tracking and visualization
- Participant management interface
- Detailed meadow view with status display
- Meadow creation and editing capabilities
- Common UI components for alerts and cards

### Changed
- Reorganized component structure for better maintainability
- Improved navigation in dual-mode layout
- Enhanced type safety across components
- Updated routing structure for movement features

### Fixed
- Component export/import inconsistencies
- Navigation routing issues
- TypeScript configuration for JSX components
- Alert component styling in dark mode

## [0.3.0] - 2024-11-09

### Added
- Authentication system with email/password and social login support
- Welcome meadow concept for new user onboarding
- Life stage progression system implementation
- Password strength validation with visual feedback
- Multi-language support (Swedish/English) for all new features
- Secure user registration flow with proper validation
- Automatic meadow participant creation for new users
- Dark/Light theme support across all components
- Responsive design for all new components

### Changed
- Restructured documentation to support party/movement duality
- Enhanced database schema with proper relationships
- Improved error handling and user feedback
- Updated navigation with authentication state
- Refined user experience with proper loading states

### Fixed
- Hydration issues in authentication flow
- Session handling and persistence
- Database relationship constraints
- Form validation feedback
- Translation system implementation

## [0.2.0] - 2024-11-01

### Added
- Implemented dual-mode dashboard with party and movement views
- Added language persistence using local storage
- Added dark/light theme support with persistence
- Created modular dashboard components for both party and movement modes
- Implemented responsive layout with sidebar navigation
- Added Swedish and English language support

### Changed
- Restructured component hierarchy for better maintainability
- Updated translation system to support multiple languages
- Improved user interface with consistent styling
- Enhanced state management with local storage integration

### Fixed
- Fixed mode switching in dual layout
- Corrected translation key structure
- Resolved hydration mismatches

## [0.1.0] - 2024-10-28
- Initial project setup
- Core infrastructure implementation
- Basic documentation structure
