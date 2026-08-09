# Virtual Me (VME) Architecture & Implementation Details

The Virtual Me (VME) application is a lightweight full-stack Single Page Application (SPA) built using React, Vite, Tailwind CSS, Node.js, Express, and SQLite. It serves as a personal developer workspace to manage issues, skills, daily standups, queued jobs (qsub), and session reports.

## Core Architecture

### 1. State Management & Persistence
- **Context API**: The entire application state is managed via React Context (`AppContext.tsx`).
- **Local SQLite Database**: The application uses a local SQLite database (`vme.db`) run via an Express backend to persist workspace data. This allows 100% local operation on your machine without relying on external cloud databases, which is ideal for enterprise environments with strict cloud access rules.
- **Local Storage Fallback**: The app continues to sync to `localStorage` as an offline-friendly fallback during development.
- **GitHub Sync**: The application can additionally sync its state to a private GitHub repository by authenticating via a Personal Access Token. This acts as a remote backup and version control for the workspace data.

### 2. Frontend Routing & Layout
- A simple tab-based routing system is implemented in `App.tsx`, avoiding the need for heavy routing libraries.
- The layout features a persistent left sidebar (`Sidebar.tsx`) for navigation, and a main content area that renders the selected manager/dashboard component.

### 3. Styling
- **Tailwind CSS**: Used extensively for utility-first styling. 
- **Lucide React**: Provides consistent vector icons across the UI.

## Modules & Features

- **Dashboard**: Displays a high-level overview of active issues, skills, and pending jobs.
- **Workspace (Issues)**: Manages tasks/issues, workflow steps, and context summaries. Allows generating a "Session Report" when a task is completed.
- **Job Queue (qsub)**: Simulates a job submission system where tasks can be queued, reordered, cancelled, and run with a specific timeout.
- **Skills & Context**: A repository of acquired skills and reference materials.
- **Daily Standups**: Tracks daily achievements, tomorrow's plans, and current blockers.
- **Blog / Lessons Learned**: A space to document architectural decisions, insights, and session reports.

## Areas for Expansion

### 1. Job Queue Execution (qsub)
- **Current State (Mocked)**: The job queue execution is simulated using a `setInterval` loop in `AppContext.tsx`. It automatically transitions jobs from `queued` to `running`, and fakes a `completed` or `failed` state based on a timeout. The execution logs are hardcoded mock strings.
- **TODO / Real Implementation**: 
  - Enhance the local Express backend to spawn actual shell processes (via `child_process`).
  - Stream real `stdout` and `stderr` back to the client via WebSockets or Server-Sent Events.

### 2. Database Refinement
- **Current State**: Uses a single JSON blob inside a local SQLite database row.
- **TODO**: Normalize the SQLite schema into individual tables for Issues, Skills, Jobs, Standups, and Blogs to allow for more complex querying and partial updates.

### 3. Authentication
- **Current State**: The app runs locally on a dev machine and assumes a single-user environment without any login barrier.
- **TODO**: Optional integration of a real authentication provider or local token-based auth to support multi-device syncing and secure remote access.
