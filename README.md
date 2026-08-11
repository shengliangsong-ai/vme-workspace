# Virtual Me (vme) Workspace

Virtual Me (vme) is an AI-powered personal developer workspace designed to streamline workflows, manage large-scale context (optimized for 1M+ token windows), and orchestrate multi-agent execution. 

## Features
- **Issue & Context Management**: Track bugs and feature requests. Build up the context (logs, code snippets, plans) for each issue sequentially.
- **Skill Manager**: Save reusable prompts, rules, and system instructions (skills) to inject into your Claude or Gemini environment.
- **GitHub Synchronization**: Push and pull your entire context state to your personal GitHub repository, allowing you to resume work across different devices or long periods of time.
- **Token Estimation**: Keep track of your context size to stay within the 1M token limit.
- **Agentic Workflows**: Multi-agent orchestration via SSE stream including Planner, Executor, and QA agents.
- **Clean Minimalism UI**: A focused, distraction-free interface built with React and Tailwind CSS.

## Documentation
- [Architecture & White Paper](WHITE_PAPER.md)

## Tech Stack
- React 19
- Vite
- Tailwind CSS v4
- Octokit (GitHub API)
- Firebase (Firestore)
- Express
- Google Genkit & Gemini SDK
