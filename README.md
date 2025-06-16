# Project Overview

This project is a Next.js application, likely a web-based system for inspections or a similar workflow, built with Firebase integration for backend services. It appears to have distinct sections for administration, inspection, and regular users, as well as features for managing clients, departments, forms, and reports.

## Directory Structure

- **.idx:** Contains development-related configurations, potentially for a specific development environment like Nix.
- **.vscode:** Contains VS Code specific settings.
- **docs:** Includes project documentation, such as the `blueprint.md`.
- **prisma:** Houses the Prisma schema for database management.
- **src/ai:** Seems to contain AI-related code, including development and Genkit configurations and AI flows.
- **src/app:** Contains the main application pages and API routes, organized into different sections like authentication (`(auth)`), main application (`(app)`), admin, inspector, profile, superadmin, and user.
- **src/components:** Includes reusable UI components, both shared components and those built with a specific UI library (likely shadcn/ui based on the file names).
- **src/config:** Holds configuration files for the application, such as navigation settings.
- **src/hooks:** Contains custom React hooks.
- **src/lib:** Houses utility functions and library configurations, including Firebase and Prisma setup.
- **src/types:** Defines TypeScript types used throughout the project.

## Next Steps

To get started, take a look at `/src/app/page.tsx`.
