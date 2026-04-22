# Visitor Management System (vstr-mgmt-system)

This project is a comprehensive Visitor Management System built using **Next.js 16 (App Router)** and **React 19**. It features a modular, feature-based architecture designed for scalability and maintainability.

## Project Overview

- **Purpose:** Manage visitors, locations, and user management for a multi-tenant environment.
- **Key Modules:** Authentication (Admin & Kiosk), Visitor Tracking, Location Management, User Management.
- **Architecture:** Feature-based organization located in `src/features`. Each feature is self-contained with its own queries, services, schemas, and components.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS (v4 compatible via @tailwindcss/postcss)
- **State Management:** 
  - **Server State:** TanStack Query v5 (React Query)
  - **Global/Client State:** Zustand v5
- **Form Handling:** React Hook Form with Zod validation
- **API Client:** Axios (standardized wrapper in `src/lib/api/api.client.ts`)
- **UI Components:** Radix UI (via Shadcn UI) and custom shared components in `src/my-components`
- **Icons:** Lucide React

## Project Structure

- `src/app`: Next.js App Router routes and layouts.
  - `(auth)`: Kiosk-related authentication routes.
  - `admin`: Admin dashboard and management routes.
- `src/features`: Core business logic organized by domain.
  - `auth`: Authentication logic, stores, and role-based guards.
  - `locations`: Location management features.
  - `visitors`: Visitor-related types and logic.
- `src/components/ui`: Base UI components (Shadcn UI).
- `src/my-components`: Project-specific shared UI components (Forms, Tables, Dialogs).
- `src/lib`: Core configurations (API client, axios interceptors, utils).
- `src/hooks`: Shared custom React hooks.

## Development Conventions

### Feature Structure
When adding a new feature, follow this directory structure within `src/features/[feature-name]`:
- `components/`: Feature-specific UI components.
- `queries/`: TanStack Query hooks and query keys.
- `services/`: API service calls using `apiClient`.
- `schemas/`: Zod validation schemas.
- `store/`: Zustand state stores (if needed).
- `types/`: TypeScript interfaces and types.

### API Calls
Use the `apiClient` from `@/lib/api/api.client` for all external requests. It automatically handles:
- Authorization headers from the Zustand `auth-storage`.
- 401 Unauthorized redirects to `/admin/signin`.
- Response data extraction (`res.data.data`).

### Form Handling
Prefer using the shared form components in `src/my-components/shared/form` (e.g., `TextField`, `SelectField`) which integrate with `react-hook-form`.

### Role-Based Access
Use the `RoleGuard` component in `src/features/auth/guards` to protect routes or components based on user roles (`admin`, `kiosk`, etc.).

## Key Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The base URL for the backend API.
