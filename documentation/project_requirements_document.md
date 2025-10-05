# Project Requirements Document (PRD)

## 1. Project Overview

**CodeGuide Starter Fullstack** is a command-line starter kit that scaffolds a modern full-stack web application with best practices baked in. It streamlines the initial setup of a React/Next.js frontend, a TypeScript-based API layer, database integration, linting, formatting, and CI configuration. By answering a short series of questions in the CLI, a developer gets a ready-to-run project with sensible defaults for folder structure, test suites, and deployment scripts.

We’re building this kit to help developers—especially teams and solo engineers—avoid repetitive boilerplate work and reduce decision fatigue on day one. Key success criteria include: 1) generating a fully functional project in under two minutes, 2) ensuring the generated code passes linting and basic tests out of the box, and 3) making it easy for users to customize or extend templates without digging through complex configs.

## 2. In-Scope vs. Out-of-Scope

In-Scope (Version 1):
- Interactive CLI that prompts for project name, database choice (SQLite or PostgreSQL), authentication (none or JWT), and styling framework (Tailwind CSS by default).
- Folder structure scaffolding:
  - `/pages`, `/components`, `/styles` for Next.js
  - `/api` or `/server` for backend API routes
  - `/prisma` or `/db` for database schema and migrations
  - `/tests` with a sample Jest test
- Built-in ESLint and Prettier configs, plus Husky pre-commit hook.
- GitHub Actions workflow template for CI: lint → test → build.
- Database setup with Prisma ORM, initial migration, and a `User` model.
- Basic README.md with setup instructions.

Out-of-Scope (Later Phases):
- Multi-tenant or microservices support.
- Production monitoring, analytics, or A/B testing setup.
- Full OAuth/social login flows.
- Docker or Kubernetes scaffolding.
- Advanced UI kits (Material UI, Chakra UI) beyond Tailwind CSS.

## 3. User Flow

A developer installs the kit globally or runs it via npx (`npx codeguide-starter-fullstack`). They’re greeted by a short wizard that asks for the project name, selects a database (default: SQLite), chooses whether to include JWT authentication, and picks styling preferences. Once they confirm choices, the CLI downloads templates, replaces placeholders (project name, author), installs dependencies, and initializes Git.

After scaffolding completes (~1–2 minutes), the user `cd`s into the new project folder. They run `npm run dev` or `yarn dev` to launch the Next.js frontend and API server. The README.md guides them through running migrations (`npx prisma migrate dev`), generating new components, and running tests (`npm test`). From here, they can start building features immediately.

## 4. Core Features

- **Interactive CLI Wizard:** Command-line prompts for project metadata and feature toggles.
- **Template Generation:** Creates a standardized folder/file structure with placeholders replaced.
- **Frontend Setup:** Next.js (React) with TypeScript, Tailwind CSS, sample page/component.
- **Backend/API Setup:** API routes inside Next.js or Express server, Prisma ORM integration.
- **Database Schema & Migrations:** Prisma schema with `User` model, initial migration script.
- **Linting & Formatting:** ESLint, Prettier, Husky pre-commit hook, standardized config.
- **Testing Kit:** Jest and React Testing Library sample tests for frontend and backend.
- **CI Configuration:** GitHub Actions workflow for automated lint, test, and build.
- **README Generator:** Auto-populated README.md with setup and usage instructions.

## 5. Tech Stack & Tools

- **Frontend:** Next.js (v13+), React (v18+), TypeScript.
- **Styling:** Tailwind CSS.
- **Backend/API:** Next.js API routes or Express.js (TypeScript).
- **Database & ORM:** Prisma ORM with SQLite (default) or PostgreSQL.
- **Testing:** Jest, React Testing Library.
- **Linters & Formatters:** ESLint, Prettier, Husky.
- **CI/CD:** GitHub Actions.
- **CLI Tooling:** Node.js (≥14.x), Inquirer.js for prompts.
- **Package Manager:** npm or Yarn.
- **Optional AI Integration:** GPT-4 via OpenAI API to customize or extend templates on demand.
- **IDE Plugins:** Support for Cursor AI or Windsurf code assistance.

## 6. Non-Functional Requirements

- **Performance:** CLI scaffolding completes within two minutes on average hardware.
- **Reliability:** Generated code must pass lint and tests with zero errors.
- **Security:** No hard-coded secrets; environment variables stored in a `.env` template. JWT setup with strong defaults.
- **Usability:** Clear CLI prompts and progress feedback. README with step-by-step instructions.
- **Maintainability:** Template files organized and documented for easy updates.
- **Compliance:** MIT license in generated project, dependency licenses audited.

## 7. Constraints & Assumptions

- Node.js v14 or higher is installed on the user’s machine.
- Internet access is available to download npm packages and templates.
- If AI customization is enabled, an OpenAI API key is provided as `OPENAI_API_KEY`.
- Default database choice (SQLite) requires no external setup; PostgreSQL requires user to supply connection string.
- Users are familiar with basic Git commands.

## 8. Known Issues & Potential Pitfalls

- **Version Drift:** Dependencies in templates might go out of date. Mitigation: pin major versions and schedule periodic updates.
- **Platform Differences:** Windows vs. macOS path separators or permission issues. Mitigation: use cross-platform Node libraries (e.g., `path` module).
- **API Rate Limits:** If AI integration is used heavily, OpenAI rate limits may apply. Mitigation: implement simple retry logic and local caching of templates.
- **Template Conflicts:** Users customizing templates may face merge conflicts. Mitigation: document upgrade path and use versioned templates.

---

This PRD serves as the single source of truth for subsequent technical documents covering detailed tech stack choices, file structure, frontend and backend guidelines, and CI/CD pipelines. All requirements are defined to avoid ambiguity and support automated or AI-driven generation of the full starter kit.