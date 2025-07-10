# Project Implementation Plan: AI Prompt Manager

This document outlines a detailed, step-by-step plan to build the AI Prompt Management Platform. The plan is broken down into granular tasks, ensuring a logical and incremental development process that aligns with the provided technical specifications and design documents.

## **Section 1: Project Foundation & Core Styling**
- [x] **Step 1: Initialize Next.js Project & Core Dependencies**
  - **Task**: Set up a new Next.js 14+ project with the App Router. Install all fundamental dependencies specified in the tech spec, including Prisma, TailwindCSS, Clerk, Zustand, TanStack Query, Framer Motion, Lucide React, React Hook Form, and Zod. Establish the basic project structure.
  - **Files**:
    - `package.json`: Define all required npm packages.
    - `next.config.mjs`: Configure basic Next.js settings.
    - `tsconfig.json`: Set up TypeScript compiler options and path aliases (`@/*`).
    - `.env.example`: Create a template for required environment variables (Clerk, Supabase/Database).
    - `.gitignore`: Standard Next.js gitignore.
    - `prisma/schema.prisma`: Initialize with the datasource (PostgreSQL) and generator blocks.
    - `lib/db.ts`: Create a singleton instance of the Prisma client.
    - `lib/utils.ts`: Set up the `cn` utility for merging Tailwind classes.
  - **Step Dependencies**: None
  - **User Instructions**: Create a `.env.local` file by copying `.env.example` and fill in the necessary API keys and secrets for your database provider (e.g., Supabase).

- [x] **Step 2: Configure TailwindCSS with Design System**
  - **Task**: Configure TailwindCSS to match the design system specified in `design.md`. This involves setting up the color palette, font families (Inter and JetBrains Mono), font sizes, spacing system, and border radii. Create a basic layout to test the configuration.
  - **Files**:
    - `tailwind.config.ts`: Extend the default theme with custom colors, fonts, and spacing from `design.md`.
    - `app/globals.css`: Import TailwindCSS base styles and define global styles, including body background color and font settings.
    - `app/layout.tsx`: Set up the root layout, apply the `Inter` font to the body, and wrap children with a basic container.
    - `app/page.tsx`: Create a simple landing page with a heading and a few elements to verify the theme is applied correctly.
  - **Step Dependencies**: Step 1
  - **User Instructions**: Verify that the fonts and colors on the home page match the design specifications.

- [x] **Step 3: Build Foundational UI Components**
  - **Task**: Create a set of core, reusable UI components based on the `design.md` specifications. This includes `Button`, `Card`, `Input`, and `Label`. These components will form the building blocks of the application's UI.
  - **Files**:
    - `components/ui/button.tsx`: Implement the `Primary`, `Secondary`, and `Ghost` button variants with styles from `design.md`, including hover and active states.
    - `components/ui/card.tsx`: Implement the `Card` component with the specified background, border, padding, and shadow.
    - `components/ui/input.tsx`: Implement the `Input` component with styles for default and focus states.
    - `components/ui/label.tsx`: Implement the `Label` component with the specified text style.
    - `components/ui/dialog.tsx`: Implement a basic `Modal/Dialog` component using Radix UI or a similar library, styled according to the design spec.
    - `components/ui/icons.tsx`: Create a central export file for `lucide-react` icons to be used throughout the app.
  - **Step Dependencies**: Step 2
  - **User Instructions**: These components will be used in subsequent steps. No direct action is needed.

## **Section 2: Authentication & User Model**
- [x] **Step 4: Define Core Prisma Schema**
  - **Task**: Define the initial database schema in `prisma/schema.prisma` for the `User`, `Prompt`, `Folder`, `Tag`, `PromptVersion`, and `_PromptToTag` models. This schema is based on the data models section of `techspec.md`.
  - **Files**:
    - `prisma/schema.prisma`: Add the full schema for `User`, `Prompt`, `Folder`, `Tag`, `PromptVersion`, and the implicit many-to-many relation for prompts and tags. Define relations and indexes.
  - **Step Dependencies**: Step 1
  - **User Instructions**: Run `npx prisma db push` (or `migrate dev`) to sync the schema with your database.

- [x] **Step 5: Integrate Clerk Authentication**
  - **Task**: Integrate Clerk for user authentication. This involves wrapping the application with the Clerk provider, creating sign-in and sign-up pages, and protecting routes using middleware.
  - **Files**:
    - `app/layout.tsx`: Wrap the entire application with `<ClerkProvider>`.
    - `middleware.ts`: Implement `authMiddleware` to protect all routes by default, defining public routes like the landing page.
    - `app/(auth)/sign-in/[[...sign-in]]/page.tsx`: Create the sign-in page using Clerk's `<SignIn />` component.
    - `app/(auth)/sign-up/[[...sign-up]]/page.tsx`: Create the sign-up page using Clerk's `<SignUp />` component.
    - `app/(auth)/layout.tsx`: Create a simple centered layout for the authentication pages.
    - `components/auth/user-button.tsx`: Create a user button component that shows the user's avatar and a dropdown menu using Clerk's `<UserButton />`.
  - **Step Dependencies**: Step 2
  - **User Instructions**: Add your Clerk public (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) and secret (`CLERK_SECRET_KEY`) keys to your `.env.local` file.

- [x] **Step 6: Implement User Data Synchronization**
  - **Task**: Create a Clerk webhook handler to listen for `user.created` and `user.updated` events. This will synchronize user data from Clerk into your application's `User` table in the database, creating a local profile for each user.
  - **Files**:
    - `app/api/webhooks/clerk/route.ts`: Implement the `POST` handler to receive and verify webhook events from Clerk.
    - `app/actions/user.actions.ts`: Create server actions `createUser` and `updateUser` that are called by the webhook handler to perform database operations.
    - `lib/validators/user.ts`: Define a Zod schema for user data validation.
  - **Step Dependencies**: Step 4, Step 5
  - **User Instructions**: Configure a new webhook in your Clerk dashboard, pointing it to the `/api/webhooks/clerk` endpoint of your deployed application (or use ngrok for local development) and subscribe to `user` events.

## **Section 3: Core Application Layout & Dashboard**
- [x] **Step 7: Build Main Application Layout**
  - **Task**: Create the primary layout for the authenticated part of the application. This will be a three-column layout: a collapsible sidebar for navigation (folders), a central column for the main content (prompt list/editor), and a right sidebar for context (version history/details).
  - **Files**:
    - `app/(main)/layout.tsx`: The main layout for the authenticated app, including the header and sidebars.
    - `app/(main)/_components/main-sidebar.tsx`: The left sidebar component, which will later hold the folder tree. For now, it can be a placeholder.
    - `app/(main)/_components/header.tsx`: The header component, containing the global search bar and the user button.
    - `app/(main)/page.tsx`: The main dashboard page that will be rendered inside the layout.
  - **Step Dependencies**: Step 3, Step 5
  - **User Instructions**: After logging in, you should see the new application layout with a header and a placeholder sidebar.

- [x] **Step 8: Implement Basic Folder Management**
  - **Task**: Implement the backend logic and frontend UI for creating, renaming, and deleting folders. This step focuses on the folder structure itself, without yet linking prompts.
  - **Files**:
    - `app/actions/folder.actions.ts`: Create Server Actions for `createFolder`, `updateFolder`, and `deleteFolder`.
    - `lib/queries/folder.queries.ts`: Write a query to fetch the user's folder hierarchy (recursive query from `techspec.md`).
    - `app/(main)/_components/main-sidebar.tsx`: Update the sidebar to fetch and display the folder tree.
    - `app/(main)/_components/folder-item.tsx`: A component to render a single folder in the sidebar, with a context menu for actions.
    - `components/modals/create-folder-modal.tsx`: A modal dialog, using the component from Step 3, to create or rename a folder.
    - `hooks/use-modal-store.ts`: Create a Zustand store to manage the state of modals (e.g., which modal is open and with what data).
  - **Step Dependencies**: Step 6, Step 7
  - **User Instructions**: You should now be able to create, rename, and delete folders from the left sidebar.

## **Section 4: Prompt Management**
- [x] **Step 9: Implement Prompt Creation and Viewing**
  - **Task**: Create the functionality to create a new prompt and view a list of prompts. A new prompt will be created with a default title and placed in a selected folder or at the root.
  - **Files**:
    - `app/actions/prompt.actions.ts`: Create a `createPrompt` server action.
    - `lib/queries/prompt.queries.ts`: Write queries to fetch prompts (e.g., `getPromptsByFolderId`).
    - `app/(main)/folders/[folderId]/page.tsx`: A page to display a list of prompts within a specific folder.
    - `app/(main)/_components/prompt-list-item.tsx`: A component to display a single prompt in a list, with title and metadata.
    - `app/(main)/_components/header.tsx`: Add a "New Prompt" button to the header.
  - **Step Dependencies**: Step 8
  - **User Instructions**: You should be able to create a new prompt, which will then appear in the prompt list for the selected folder.

- [x] **Step 10: Implement the Prompt Editor**
  - **Task**: Integrate the CodeMirror 6 editor for editing prompt content. This includes setting up syntax highlighting for Markdown, debounced auto-saving, and connecting it to a server action to update the prompt.
  - **Files**:
    - `app/(main)/prompts/[promptId]/page.tsx`: The main page for editing a specific prompt.
    - `app/(main)/prompts/[promptId]/_components/editor.tsx`: The CodeMirror 6 editor component. This will be a client component.
    - `hooks/use-debounce.ts`: A custom hook for debouncing the auto-save functionality.
    - `app/actions/prompt.actions.ts`: Add an `updatePromptContent` server action.
    - `lib/editor/extensions.ts`: A file to configure CodeMirror extensions (e.g., markdown language support, theme).
  - **Step Dependencies**: Step 9
  - **User Instructions**: When you navigate to a prompt, you should see the editor and be able to type in it. Changes should be auto-saved after a short delay.

- [x] **Step 11: Implement Prompt Versioning**
  - **Task**: Implement the version control system. Every time a prompt is saved with significant changes, a new entry should be created in the `PromptVersion` table. Build the UI to view and restore previous versions.
  - **Files**:
    - `app/actions/prompt.actions.ts`: Modify the save logic to create a new `PromptVersion`. Add a `restoreVersion` action.
    - `lib/queries/prompt.queries.ts`: Add a `getPromptVersions` query.
    - `app/(main)/prompts/[promptId]/_components/version-history-sidebar.tsx`: A component for the right sidebar to display the list of versions.
    - `app/(main)/prompts/[promptId]/_components/version-item.tsx`: A component to render a single version in the history.
    - `components/modals/restore-version-modal.tsx`: A confirmation dialog for restoring a previous version.
  - **Step Dependencies**: Step 10
  - **User Instructions**: As you edit a prompt, new versions should appear in the right sidebar. You should be able to click a version and restore it.

## **Section 5: Advanced Features & Polish**
- [x] **Step 12: Implement Drag-and-Drop Organization**
  - **Task**: Add drag-and-drop functionality using `@dnd-kit` to reorder prompts within a folder and move prompts between folders in the sidebar. This will involve optimistic UI updates for a smooth user experience.
  - **Files**:
    - `app/(main)/_components/main-sidebar.tsx`: Wrap the folder list with DndContext and drop targets.
    - `app/(main)/_components/folder-item.tsx`: Make the folder item a drop target.
    - `app/(main)/folders/[folderId]/page.tsx`: Wrap the prompt list with DndContext and make items draggable.
    - `app/(main)/_components/prompt-list-item.tsx`: Make the prompt list item draggable.
    - `app/actions/prompt.actions.ts`: Add a `movePrompt` server action.
    - `hooks/use-optimistic-update.ts`: (Optional) A custom hook to manage optimistic state updates for dnd.
  - **Step Dependencies**: Step 9
  - **User Instructions**: You should be able to drag prompts to reorder them or move them into different folders in the sidebar.

- [x] **Step 13: Implement Tagging System**
  - **Task**: Implement the full tagging system. This includes a UI for adding/removing tags on a prompt and the ability to filter prompts by tags.
  - **Files**:
    - `app/actions/tag.actions.ts`: Create server actions for `addTagToPrompt` and `removeTagFromPrompt`.
    - `lib/queries/tag.queries.ts`: Write queries to fetch tags for a prompt and search for tags.
    - `components/prompts/tag-input.tsx`: A component for the prompt editing page that allows users to add and remove tags with autocomplete.
    - `components/ui/badge.tsx`: A styled badge component for displaying tags, based on `design.md`.
    - `app/(main)/prompts/[promptId]/page.tsx`: Integrate the `tag-input` component.
  - **Step Dependencies**: Step 10
  - **User Instructions**: On the prompt edit page, you can now add and remove tags.

- [x] **Step 14: Implement Full-Text Search**
  - **Task**: Implement the global search functionality using PostgreSQL's full-text search. This includes the search bar in the header and a dedicated search results page.
  - **Files**:
    - `app/actions/search.actions.ts`: Create a `searchPrompts` server action that uses `$queryRaw` with `to_tsvector`.
    - `app/(main)/_components/global-search.tsx`: The search bar component with debounced input that triggers the search.
    - `app/search/page.tsx`: The search results page that uses the `searchPrompts` action and displays results.
    - `app/search/_components/search-result-item.tsx`: A component to display a single search result.
    - `prisma/migrations/.../migration.sql`: (If using migrations) Add a GIN index to the `prompts` table to accelerate full-text search.
  - **Step Dependencies**: Step 9
  - **User Instructions**: Use the search bar in the header to find prompts by title or content.
