# CrewAI Dashboard Application

## Overview

This is a comprehensive, enterprise-grade CrewAI Dashboard application built with React 18 and TypeScript. The application manages multi-agent AI workflows with real-time execution monitoring, advanced analytics, and a professional UI/UX. It provides a complete interface for creating and managing AI agents, tasks, crews, templates, and monitoring executions with real-time streaming output.

The application features a full-stack architecture with a React frontend using Vite for development, Express.js backend with WebSocket support for real-time communication, and PostgreSQL database with Drizzle ORM for data persistence. The UI is built with Tailwind CSS and shadcn/ui components for a modern, responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Styling**: Tailwind CSS with custom design system and shadcn/ui component library
- **State Management**: React hooks with TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives wrapped in custom components for accessibility
- **Real-time Communication**: Custom WebSocket hook for real-time execution monitoring

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **WebSocket**: ws library for real-time communication between client and server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Data Storage**: In-memory storage implementation with interface for database abstraction
- **API Design**: RESTful API with WebSocket endpoints for real-time features

### Database Schema
The application uses a PostgreSQL database with the following core entities:
- **Agents**: AI agents with roles, goals, backstories, and configuration (model, temperature, tools)
- **Tasks**: Work items with descriptions, priorities, assigned agents, and progress tracking
- **Crews**: Collections of agents and tasks with execution status and progress
- **Templates**: Pre-built configurations for common workflows
- **Files**: Generated outputs and documents from executions
- **Executions**: Real-time execution tracking with metrics and status

### Authentication and Authorization
Currently implements a basic structure without authentication. The system is designed to be extended with proper authentication mechanisms.

### Real-time Features
- WebSocket connection for live execution monitoring
- Real-time progress updates and metrics
- Live streaming of execution output and logs
- Automatic reconnection and error handling

### Development and Build
- **Development**: Vite dev server with hot module replacement
- **Build**: Vite for frontend bundling, esbuild for backend compilation
- **Database**: Drizzle migrations for schema management
- **Configuration**: TypeScript path mapping for clean imports

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connections
- **drizzle-orm**: TypeScript-first ORM for database operations
- **drizzle-kit**: CLI tool for database migrations and schema management

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitive components
- **wouter**: Lightweight routing library
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation

### UI and Styling
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

### Backend and Communication
- **express**: Web application framework
- **ws**: WebSocket library for real-time communication
- **connect-pg-simple**: PostgreSQL session store for Express

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tools

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **embla-carousel-react**: Carousel component functionality