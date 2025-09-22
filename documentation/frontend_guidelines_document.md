# Frontend Guideline Document

This document explains the frontend setup for the `codeguide-starter-fullstack` project in clear, everyday language. It covers architecture, design principles, styling, component organization, state handling, routing, performance, and testing practices.

---

## 1. Frontend Architecture

**Frameworks and Libraries**
- **Next.js 13** (or Remix): Provides file-based routing, built-in API routes, and support for server-side rendering (SSR) and static site generation (SSG).
- **React 18**: The UI library that lets us build reusable components.
- **TypeScript**: Adds type safety to catch errors early and make the code easier to understand.
- **CSS**: We use plain CSS files (`globals.css` and `theme.css`) with CSS custom properties for theming.

**How It Supports Scalability, Maintainability, and Performance**
- **File-based routing** means each folder and file under `app/` maps directly to a URL path. Adding a new page is as easy as creating a new file.
- **Nested layouts** (`app/layout.tsx` and `app/dashboard/layout.tsx`) allow us to share headers, footers, and sidebars without repeating code.
- **Component-based structure** (React) promotes reuse: build small, focused pieces that can be combined in different ways.
- **TypeScript and linting** (ESLint & Prettier) ensure consistent code style, fewer runtime errors, and easier onboarding for new developers.
- **SSR/SSG** speeds up initial page loads and improves SEO out of the box.

---

## 2. Design Principles

We follow these guiding principles to create a user-friendly interface:

1. **Usability**
   - Simple, predictable navigation.
   - Clear calls to action (e.g., “Sign In,” “Sign Up,” “Sign Out”).
2. **Accessibility**
   - Semantic HTML elements (forms, buttons, headings).
   - ARIA attributes and keyboard support for screen readers.
3. **Responsiveness**
   - Mobile-first CSS breakpoints.
   - Flexible layouts that adapt to different screen sizes.
4. **Consistency**
   - Uniform color scheme and typography across all pages.
   - Reusable component styles to avoid visual drift.

How We Apply These
- Forms on sign-in and sign-up pages include error messages and focus management for keyboard navigation.
- The dashboard layout uses clear headings and side navigation that collapse gracefully on smaller screens.
- All interactive elements (links, buttons) have hover/focus styles for better discoverability.

---

## 3. Styling and Theming

**Styling Approach**
- **CSS files**: We have two main files:
  1. `globals.css` – Base styles for typography, layout resets, and utility classes.
  2. `theme.css` – CSS custom properties (variables) defining the color palette and spacing scales.
- **CSS Methodology**: We adopt a simple, modular approach:
  - Use descriptive class names in **BEM** style (e.g., `.button`, `.button--primary`).
  - Keep component styles close to their markup in dedicated `.css` files if needed.

**Theming**
- All colors and fonts are defined as CSS variables in `theme.css`.
- Switching themes (e.g., light/dark) is a matter of toggling a single class on `<html>` or `<body>`.

**Visual Style**
- **Overall Style**: Flat, modern design with generous white space and clear typography.
- **Color Palette**:
  - `--color-primary`: #4F46E5 (indigo)
  - `--color-secondary`: #10B981 (emerald)
  - `--color-accent`: #F59E0B (amber)
  - `--color-background`: #F9FAFB (light gray)
  - `--color-surface`: #FFFFFF (white)
  - `--color-border`: #E5E7EB (gray)
  - `--color-text`: #111827 (dark gray)
  - `--color-text-muted`: #6B7280 (mid gray)
- **Typography**:
  - Primary font: **Inter**, with system-font fallbacks (`-apple-system, BlinkMacSystemFont, sans-serif`).
  - Base font size: 16px; line height: 1.5; clear hierarchy with `h1`–`h4` sizing.

---

## 4. Component Structure

**Organization**
- **Feature-based folders** under `app/` for pages and layouts (`dashboard/`, `sign-in/`, `sign-up/`).
- A top-level **`components/`** directory for shared UI elements (e.g., Button, Input, Card).
- Each component has:
  - A `.tsx` file for markup and logic.
  - A `.module.css` or scoped CSS file for styles (if more CSS is needed beyond the global/theme).  

**Reusability and Maintainability**
- Components are **small and focused**: one responsibility each (e.g., a Button that accepts props for label and click handler).
- **Props** are well-typed with TypeScript interfaces for clarity.
- **Documentation** is encouraged: add brief comments or Storybook stories (if integrated) to show usage examples.

---

## 5. State Management

**Approach**
- **Local state** with `useState` for simple UI interactions.
- **Global state** (e.g., authenticated user info) via React **Context API**:
  - Create an `AuthContext` to hold user data and helper methods (`signIn`, `signOut`).
  - Wrap the app in an `AuthProvider` in `app/layout.tsx` so all pages can access it.

**Sharing State Across Components**
- Components subscribe to context values via `useContext(AuthContext)`.
- For data fetching (dashboard content), keep local state or introduce **React Query** (or SWR) in the next phase to handle caching, loading, and error states.

---

## 6. Routing and Navigation

**Routing**
- **File-based routing** in Next.js (`app/` folder):
  - A file `app/dashboard/page.tsx` maps to `/dashboard`.
  - API routes in `app/api/auth/route.ts` map to `/api/auth`.
- **Nested layouts**:
  - `app/layout.tsx` – Global wrapper with header and footer.
  - `app/dashboard/layout.tsx` – Dashboard-specific wrapper with sidebar.

**Navigation**
- Use Next.js’s `<Link>` component for client-side transitions without full page reloads.
- Protect routes by checking `AuthContext` in `middleware.ts` or inside `layout.tsx`. If the user isn’t signed in, redirect to `/sign-in`.

---

## 7. Performance Optimization

**Built-in Next.js features**
- **SSR/SSG**: Pages are pre-rendered on the server or at build time for faster first paint.
- **Automatic code splitting**: Only the JavaScript needed for the current page is loaded.
- **Image optimization**: Use Next.js `<Image>` component to serve appropriately sized images.

**Additional Strategies**
- **Dynamic imports** (`next/dynamic`) for heavy components or charts in the dashboard.
- **Lazy-load non-critical assets** (e.g., third-party widgets) with `React.lazy` and `Suspense`.
- **Minify and compress** CSS/JS during the build (handled automatically by Next.js).

---

## 8. Testing and Quality Assurance

**Linting & Formatting**
- **ESLint** with `eslint-config-next` to enforce best practices.
- **Prettier** for consistent code formatting on save or pre-commit.

**Unit Tests**
- **Jest** + **React Testing Library** for component logic and rendering tests.
- Aim for testing:
  - Form components (validation, error messages).
  - Button clicks and UI state changes.

**Integration Tests**
- Mock API routes using **MSW** (Mock Service Worker) to simulate `/api/auth` responses.
- Verify that pages fetch data correctly and render loading/error states.

**End-to-End Tests**
- **Cypress** or **Playwright** for full user flows:
  - Sign-up ➔ Sign-in ➔ Dashboard access ➔ Sign-out.
  - Redirects when not authenticated.

**Continuous Integration**
- Run lint, unit, and integration tests on every pull request using **GitHub Actions**.
- Block merges until all checks pass.

---

## 9. Conclusion and Overall Frontend Summary

This guideline lays out a clear path for building, styling, and maintaining the frontend of our starter kit. By leveraging Next.js, React, and TypeScript, we ensure a scalable, high-performance foundation. Our design principles (usability, accessibility, responsiveness) keep the user experience front and center. A flat, modern visual style with a defined color palette and Inter font gives the app a clean look. Component-based structure and Context API state handling make the code easy to extend. File-based routing and nested layouts simplify navigation and consistency. Performance is optimized through SSR/SSG, code splitting, and image handling. Finally, a robust testing strategy—unit, integration, and end-to-end—backs up code quality. Together, these guidelines align with our goal: a reliable, developer-friendly starter that anyone can pick up and confidently build upon.