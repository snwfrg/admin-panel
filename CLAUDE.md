# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- **Start development server**: `npm run dev` - Runs Vite dev server with HMR
- **Build for production**: `npm run build` - Compiles TypeScript and builds with Vite
- **Lint code**: `npm run lint` - Runs ESLint on TypeScript/React files
- **Preview production build**: `npm run preview` - Serves production build locally

## Tech Stack & Architecture
This is a React + TypeScript admin panel built with:
- **Vite** as the build tool and dev server
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **ESLint** with TypeScript and React configs

### Project Structure
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component (currently shows placeholder for REST API interface)
- `src/index.css` - Global styles including Tailwind imports
- Configuration files: `vite.config.ts`, `eslint.config.js`, `tailwind.config.js`

### Current State
The project is a minimal setup with a basic admin panel layout. The main component displays a placeholder indicating it's designed for REST API integration, suggesting this will be an interface for API management or data visualization.

## Key Configuration Notes
- Uses Vite's React plugin for Fast Refresh
- ESLint configured with recommended TypeScript and React rules
- Tailwind CSS configured to scan all React/TypeScript files in src/
- TypeScript strict mode enabled with separate configs for app and build tools