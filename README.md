# Virtual Me (vme) Workspace

Virtual Me (vme) is a workflow and context management application designed to maintain your Claude AI context, skills, and memory synchronized with a GitHub repository. It is optimized for 1M token workflows, allowing you to efficiently manage large problem-solving sessions, track bugs, and manage your custom AI skills.

## Features

- **Issue & Context Management**: Track bugs and feature requests. Build up the context (logs, code snippets, plans) for each issue sequentially.
- **Skill Manager**: Save reusable prompts, rules, and system instructions (skills) to inject into your Claude environment.
- **GitHub Synchronization**: Push and pull your entire context state (`vme-state.json`) to your personal GitHub repository, allowing you to resume work across different devices or long periods of time.
- **Token Estimation**: Keep track of your context size to stay within the 1M token limit.
- **Clean Minimalism UI**: A focused, distraction-free interface built with React and Tailwind CSS.

## Local Installation

Virtual Me (vme) is designed to run 100% locally on your laptop or Linux dev machine with zero dependencies on external cloud databases. It uses a local SQLite database (`vme.db`) to persist your workspace data natively.

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm` (Node Package Manager)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will start, and the SQLite database (`vme.db`) will be initialized automatically in the root folder. You can view the app at `http://localhost:3000`.

### Production Build

To build and run the optimized production version locally:
```bash
npm run build
npm run start
```

## Usage Guide

1. **GitHub Configuration**:
   - Go to the **Settings** tab.
   - Enter your repository in the format `owner/repo` (e.g., `shengliangsong-ai/vme`).
   - Enter a GitHub Personal Access Token (PAT) with `repo` scope to allow the app to read and write the `vme-state.json` file.
   - (Optional) Configure your Claude API key if needed for future integrations.

2. **Managing Skills**:
   - Go to the **Skills & Context** tab to create reusable rules or prompts.
   - These are saved and synchronized to your GitHub repo.

3. **Workflow Execution**:
   - Go to the **Dashboard** and create a new Issue (Bug Fix or New Feature).
   - In the **Workspace**, work through your checkpoints, pasting relevant logs, code, and Claude's responses.
   - Fill out the Final Context Summary when the issue is resolved.

4. **Syncing**:
   - Use the **Push to GitHub** and **Pull State** buttons in the sidebar to keep your context synchronized across your devices.

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- Octokit (GitHub API)
- Lucide React (Icons)
