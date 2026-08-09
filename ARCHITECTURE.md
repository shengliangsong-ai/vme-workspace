# Virtual Me (VME) Architecture & Implementation Details

The Virtual Me (VME) application is a client-side Single Page Application (SPA) built using React, Vite, and Tailwind CSS. It serves as a personal developer workspace to manage issues, skills, daily standups, queued jobs (qsub), and session reports.

## Core Architecture

### 1. State Management
- **Context API**: The entire application state is managed via React Context (`AppContext.tsx`).
- **Local Persistence**: State is serialized and saved to the browser's `localStorage` (`vme-state`). This allows the app to maintain state across page reloads without a traditional backend database.
- **GitHub Sync**: The application can sync its state to a GitHub repository by authenticating via a Personal Access Token. This acts as a remote backup and version control for the workspace data.

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

## Mocked Components & "TODO" Items

Because VME is designed as a lightweight client-side application, several components are currently **mocked** or simplified. These represent the primary areas for future backend expansion:

### 1. Job Queue Execution (qsub)
- **Current State (Mocked)**: The job queue execution is simulated using a `setInterval` loop in `AppContext.tsx`. It automatically transitions jobs from `queued` to `running`, and fakes a `completed` or `failed` state based on a timeout. The execution logs are hardcoded mock strings.
- **TODO / Real Implementation**: 
  - Connect to a real backend service (e.g., Node.js/Express) that can spawn actual shell processes (via `child_process`).
  - Stream real `stdout` and `stderr` back to the client via WebSockets or Server-Sent Events.
  - Implement a real task queue like BullMQ or Celery.

### 2. Database & Persistence
- **Current State (Mocked)**: Uses browser `localStorage` as the primary data store.
- **TODO / Real Implementation**: 
  - Replace `localStorage` with a persistent database like PostgreSQL (Cloud SQL) or Firestore.
  - Implement a backend API to manage CRUD operations for Issues, Skills, Jobs, Standups, and Blogs.

### 3. Authentication
- **Current State (Mocked)**: The app assumes a single-user environment without any login barrier.
- **TODO / Real Implementation**: 
  - Integrate a real authentication provider (e.g., Firebase Auth or standard OAuth) to support multi-device syncing, user accounts, and secure access.

### 4. GitHub Integration
- **Current State (Simplification)**: Uses direct REST API calls from the client to read/write a JSON file in a GitHub repository using a user-provided Personal Access Token (PAT).
- **TODO / Real Implementation**:
  - Storing PATs in localStorage and making client-side requests is not ideal for production security.
  - Move GitHub API interactions to a secure backend proxy route where the token can be stored as an environment variable, or implement a proper GitHub OAuth App flow.
