# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is a TypeScript project using Bun as the runtime and package manager. The project name "odpady-harmonogram-bp" suggests it's related to waste collection schedules for Bielsko-Biała, Poland.

## Commands

### Package Management
- `bun install` - Install dependencies
- `bun add <package>` - Add a dependency
- `bun add -d <package>` - Add a dev dependency
- `bunx <package>` - Execute a package without installing

### Running
- `bun run index.ts` - Run the main entry point
- `bun --hot ./index.ts` - Run with hot reload for development

### Testing
- `bun test` - Run all tests
- `bun test <file>` - Run a specific test file
- `bun test --watch` - Run tests in watch mode

### Building
- `bun build <file>` - Build a file
- `bun build <file> --outdir <dir>` - Build to a specific directory

### Linting & Type Checking
- `bun run tsc` - Run TypeScript compiler for type checking
- No specific lint command configured - add one if needed

## Code Style Guidelines

### TypeScript Configuration
- Target: ESNext
- Module: Preserve (Bun handles module resolution)
- Strict mode enabled
- No implicit any, no unchecked indexed access
- JSX support for React (react-jsx)

### Import Style
- Use ES module imports: `import { foo } from 'bar'`
- Prefer named exports over default exports
- Import React components explicitly: `import React from 'react'`
- Use Bun-specific imports when available: `import { Database } from 'bun:sqlite'`

### File Naming
- Use kebab-case for files: `waste-schedule.ts`
- Use PascalCase for React components: `WasteSchedule.tsx`
- Test files should end with `.test.ts` or `.spec.ts`

### Code Formatting
- No specific formatter configured - consider adding Prettier or Biome
- Use consistent indentation (2 or 4 spaces)
- Place opening braces on the same line
- Use semicolons consistently

### Error Handling
- Use try-catch blocks for async operations
- Prefer throwing errors over returning error objects
- Use TypeScript's `never` type for unreachable code paths
- Implement proper error boundaries in React components

### Naming Conventions
- Variables and functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Classes and interfaces: PascalCase
- Types: PascalCase with descriptive names
- Enums: PascalCase

### API Patterns
- Use `Bun.serve()` for HTTP servers instead of Express
- Use `bun:sqlite` for database operations
- Use `Bun.file()` for file operations instead of Node.js fs
- Use `Bun.$` for shell commands instead of execa

### Testing Patterns
- Use `bun:test` for testing framework
- Structure tests with `test()` and `expect()`
- Group related tests with `describe()`
- Mock external dependencies when needed

### React Guidelines (if applicable)
- Use functional components with hooks
- Prefer `createRoot` over legacy ReactDOM.render
- Use TypeScript for prop definitions
- Implement proper key props for lists

### Environment Variables
- Bun automatically loads `.env` files
- Don't use dotenv package
- Access via `process.env.VARIABLE_NAME`

### Database Patterns
- Use `bun:sqlite` for SQLite databases
- Use prepared statements for queries
- Implement proper connection handling
- Use transactions for multi-step operations

## Development Workflow

1. Install dependencies: `bun install`
2. Make changes following the style guidelines above
3. Run type checking: `bun run tsc`
4. Run tests: `bun test`
5. Test the application: `bun run index.ts`

## Cursor Rules Integration

This repository includes Cursor rules that enforce using Bun over Node.js alternatives:
- Use `bun` instead of `node` or `ts-node`
- Use `bun test` instead of Jest or Vitest
- Use `bun build` instead of webpack or esbuild
- Use `bun install` instead of npm/yarn/pnpm
- Use Bun's built-in APIs (Bun.serve, bun:sqlite, etc.)

## Project Structure

- `index.ts` - Main entry point
- `package.json` - Bun-based package configuration
- `tsconfig.json` - TypeScript configuration with strict settings
- `.cursor/rules/` - Cursor IDE rules for Bun usage

## Notes

- This is a minimal Bun project setup
- Consider adding testing, linting, and formatting configurations as the project grows
- The project appears to be in early development stage with basic structure