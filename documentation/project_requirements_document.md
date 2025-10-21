# Project Requirements Document (PRD)

## 1. Project Overview

**Paragraph 1:**
The `codeguide-starter-fullstack` is a ready-to-use starter kit for modern full-stack web applications. It lays out a solid project structure using a React-based framework (Next.js or Remix) with file-based routing, serverless API routes, and TypeScript. Out of the box, it includes user authentication (sign-up and sign-in), a protected user dashboard area, nested layouts for consistent UI, global styling, and a mock data source to populate components during development.

**Paragraph 2:**
This starter aims to help developers save setup time and avoid repetitive boilerplate. By providing pre-configured authentication endpoints, layout components, and styling conventions, teams can focus on business logic and features instead of project scaffolding. Success is measured by how quickly a developer can clone the repo, run `npm install && npm run dev`, and see a functional sign-up/sign-in flow plus dashboard UI in under five minutes.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- File-based routing under `app/` directory for pages and API routes.
- Authentication endpoints in `app/api/auth/route.ts` supporting user sign-up and sign-in flows.
- Sign-in page (`app/sign-in/page.tsx`) and sign-up page (`app/sign-up/page.tsx`) UIs.
- Global layout (`app/layout.tsx`) and nested dashboard layout (`app/dashboard/layout.tsx`).
- Dashboard page (`app/dashboard/page.tsx`) displaying mock data from `data.json`.
- Global styles (`globals.css`) and theme overrides (`theme.css`).
- Use of TypeScript (`.tsx` and `.ts` files) and React components.
- Local mock data source for development, no external database required.

**Out-of-Scope (Phase 2+):**
- Integration with a real database (SQL, NoSQL) or ORM.
- Third-party authentication providers (Google, GitHub, etc.).
- Production-grade session management (JWT refresh tokens, secure cookies).
- Advanced state management libraries (Redux, Zustand) beyond React Context.
- Internationalization (i18n) and multi-locale support.
- Comprehensive automated testing (unit, integration, end-to-end).
- Deployment scripts or CI/CD pipelines.

## 3. User Flow

**Paragraph 1:**
A new visitor lands on the homepage and sees options to "Sign Up" or "Sign In" in the navigation bar (rendered by `app/layout.tsx`). If they choose "Sign Up," they are taken to `/sign-up`, where `app/sign-up/page.tsx` shows a form asking for email and password. On submission, the form calls the API endpoint at `/api/auth/route.ts`. If registration succeeds, the user is automatically redirected to the dashboard; if it fails, an inline error message appears.

**Paragraph 2:**
Returning users click "Sign In" and arrive at `/sign-in`. After entering credentials, the form POSTs to `/api/auth/route.ts`. On successful authentication, the user session is stored (in memory or via cookie), and the user is redirected to `/dashboard`. The dashboard page (`app/dashboard/page.tsx`) loads mock data from `data.json`, and its layout (`app/dashboard/layout.tsx`) adds a sidebar or header specific to dashboard pages. Users can navigate back to other pages or log out, which clears the session and returns them to the sign-in page.

## 4. Core Features

- **Authentication Module**: Sign-up and sign-in endpoints in `app/api/auth/route.ts`. Handles POST requests for new users and login, performs basic validation.
- **Protected Dashboard**: A `/dashboard` route that checks authentication; unauthenticated requests redirect to `/sign-in`.
- **Nested Layouts**: `app/layout.tsx` for global elements (header, footer), `app/dashboard/layout.tsx` for dashboard-specific navigation.
- **File-Based Routing**: URL paths map to folders and files under `app/` (e.g., `app/sign-up/page.tsx` → `/sign-up`).
- **Mock Data Source**: `data.json` provides sample data for the dashboard to render charts or lists without a real backend.
- **Styling**: `globals.css` for site-wide styles, `theme.css` for color palettes and overrides. Supports future integration with CSS modules or Tailwind.
- **TypeScript & React**: All components and routes use `.tsx` and `.ts` for type safety and clarity.

## 5. Tech Stack & Tools

**Frontend**: Next.js 13 (or Remix), React 18, TypeScript 4.x.  
**Backend/API**: Node.js 16+, built-in API routes of Next.js/Remix.  
**Styling**: Plain CSS (`globals.css`, `theme.css`), ready for Tailwind or CSS modules.  
**Linting & Formatting**: ESLint with `eslint-config-next` (or equivalent), Prettier.  
**Mock Data**: Static JSON file (`data.json`) within repo.  
**IDE Plugins**: Optional ESLint and Prettier integrations.  
**Version Control**: Git, with a standard `.gitignore` for Node and VSCode.

## 6. Non-Functional Requirements

- **Performance**: First meaningful paint under 2 seconds on a 3G network. API calls should return within 200ms in development mode.
- **Security**: Sanitize user inputs. Hash passwords before storage (even in mock). Set HTTP-only and Secure flags if cookies are used.
- **Scalability**: Clear separation of UI, API, and data layers to allow future growth.
- **Usability**: Responsive design, semantic HTML, basic ARIA roles for forms and navigation. Works on desktop and mobile screens.
- **Maintainability**: Strict TS config (`noImplicitAny`, `strictNullChecks`), consistent code style enforced by ESLint/Prettier.
- **Compliance**: Code organized to allow easy GDPR opt-in/out for user data.

## 7. Constraints & Assumptions

- **Framework Choice**: Assumes Next.js 13 conventions—React Server Components, file-based routing. If Remix is chosen, adapt folder names to `routes/` instead of `app/`.
- **Mock Data Only**: No real database connection; data lives in `data.json`. Future phases must swap this out with real DB logic.
- **Node Environment**: Requires Node.js version 16 or higher.
- **Session Storage**: Assumes in-memory or cookie session for development. Production session store (Redis, etc.) is not included.
- **Single Language**: English UI only.

## 8. Known Issues & Potential Pitfalls

- **Ambiguous Framework**: The code structure could fit Next.js or Remix. Pick one and align config (e.g., `next.config.js` vs `remix.config.js`).  
- **Authentication Security**: Current route handler may lack robust hashing, salting, and CSRF protection. Plan to integrate `bcrypt` and CSRF tokens in Phase 2.  
- **Hydration Mismatch**: Using React Server Components and client components improperly can cause hydration errors. Clearly mark client functions with `'use client'`.  
- **Mock Data Limitations**: Relying on a static JSON file means no real state updates. For CRUD patterns, swap in a fake REST server (json-server) or stubbed GraphQL mock.  
- **Global CSS Collisions**: Without CSS modules or namespacing, global styles can clash. Recommend migrating to CSS modules or utility classes for larger apps.

---

This PRD should serve as the single source of truth for all subsequent technical docs—tech stack details, frontend and backend guidelines, file structures, and app flow definitions. Every requirement here is precise to avoid any guesswork during implementation.