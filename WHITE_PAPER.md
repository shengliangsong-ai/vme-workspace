# Virtual Me (vme): An AI-Native Personal Context and Workflow Management System
*A Comprehensive Architecture and Engineering White Paper*

---

## 1. Executive Summary

Modern software development and problem-solving frequently demand the management of massive amounts of context, including system architecture, bug history, codebase snippets, and acquired skills. Current systems—ranging from simple note-taking applications to complex project management tools—struggle to effectively synchronize this context between the human developer and Large Language Models (LLMs). 

**Virtual Me (vme)** addresses this challenge by transitioning the traditional personal workspace into an active, collaborative digital twin capable of planning, executing, and self-improving through agentic workflows. By integrating a full-stack React and Express architecture with Google's Genkit, the Gemini API (Interactions and Agents APIs), and Firebase Firestore, Virtual Me provides a persistent NoSQL Memory Bank and an integrated multi-agent job queue.

---

## 2. System Architecture Overview

Virtual Me is constructed as a modern, cloud-native full-stack application designed for extremely low latency UI updates and highly reliable long-running AI streaming.

### 2.1. High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Client [Client-Side (Browser)]
        UI[React 19 + Vite]
        State[React Context API]
        SSE_Client[EventSource / SSE Client]
        UI --> State
        State --> SSE_Client
    end

    subgraph Server [Server-Side (Express)]
        API[REST & SSE Endpoints]
        Router[Job Router / qsub]
        Genkit_Core[Google Genkit Orchestrator]
        Embedder[textEmbedding-004]
    end

    subgraph External_Services [External Cloud Services]
        Firestore[(Firebase Firestore)]
        Gemini[Google Gemini 1.5 Pro/Flash]
        GitHub[GitHub API]
    end

    %% Connections
    UI -- "HTTP GET/POST" --> API
    SSE_Client -- "Listens (text/event-stream)" --> API
    API --> Router
    Router --> Genkit_Core
    Genkit_Core <--> Gemini
    Genkit_Core <--> Embedder
    API <--> Firestore
    API <--> GitHub
    
    %% Styling
    classDef client fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef server fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef cloud fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    class Client client;
    class Server server;
    class External_Services cloud;
```

### 2.2. Tier Breakdown
1. **Frontend Tier**: Built with React 19 and Vite for lightning-fast hot module replacement. Tailwind CSS v4 and Lucide React provide a distraction-free, minimalist user interface.
2. **Backend Orchestration Tier**: An Express Node.js server acts as the central hub. It handles routing, memory retrieval, and agent delegation.
3. **Data & Persistence Layer**: Firebase Firestore serves as a scalable, NoSQL "Memory Bank," providing persistent cross-session context, schema flexibility, and real-time synchronization.

---

## 3. The Orchestration Engine: Deep Dive

One of the most powerful features of Virtual Me is its ability to **orchestrate** complex multi-agent workflows. Rather than sending a single prompt to an LLM, the system queues a job that passes through specialized agents.

### 3.1. How "Orchestrate" Works (Demo Flow)

When a user submits a command via the UI (e.g., *"Build a new authentication flow"*), the following sequence occurs:

1. **Job Initialization**: The React UI enqueues a job and opens an `EventSource` connection to `/api/jobs/orchestrate?command=...`.
2. **SSE Handshake**: The Express server immediately responds with headers `Content-Type: text/event-stream` and `X-Accel-Buffering: no`, ensuring the HTTP connection remains open for streaming real-time tokens.
3. **Planner Agent Invocation**: The backend uses the `GoogleGenAI` Interactions API to summon the Planner Agent. The planner breaks the task into deterministic steps.
4. **Executor Handoff**: Once the plan is generated, it is passed to the Executor Agent, which generates the actual code or modifies the workspace state.
5. **Continuous Streaming**: Throughout this process, every token, status update, and agent thought-process is yielded back to the Express response stream using `res.write()`.

### 3.2. Orchestration Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React Client
    participant Express as Backend Server
    participant Gemini as Gemini API (Agents)
    participant DB as Firestore DB

    User->>Frontend: Clicks "Run Workflow"
    Frontend->>Express: GET /api/jobs/orchestrate?command=X
    Express-->>Frontend: 200 OK (text/event-stream)
    
    Express->>Frontend: Stream [Orchestrator]: Starting workflow...
    
    Note over Express,Gemini: 1. Planning Phase
    Express->>Gemini: genai.interactions.create(agent: "planner")
    Gemini-->>Express: Stream Delta (Tokens)
    Express->>Frontend: Stream UI Updates (Plan generating)
    
    Note over Express,Gemini: 2. Execution Phase
    Express->>Gemini: genai.interactions.create(agent: "executor", prompt: Plan)
    Gemini-->>Express: Stream Delta (Code/Actions)
    Express->>Frontend: Stream UI Updates (Code generating)
    
    Note over Express,DB: 3. Persistence Phase
    Express->>DB: Save Workflow Result & Context
    DB-->>Express: Ack
    
    Express->>Frontend: Stream [Orchestrator]: Workflow Complete
    Express->>Frontend: Connection Close
```

---

## 4. Multi-Agent Job Lifecycle and Flow

The application doesn't just pass text; it manages state transitions between AI personas.

### 4.1. Workflow Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle

    state Idle {
        [*] --> WaitingForInput
    }

    state Job_Queued {
        [*] --> InitializingStream
        InitializingStream --> ConnectingSSE
    }

    state Multi_Agent_Execution {
        state "Planner Agent" as Planner
        state "Executor Agent" as Executor
        state "QA / Self-Improve Agent" as QA
        
        Planner --> Executor: Structured Plan (JSON/Markdown)
        Executor --> QA: Implementation Artifacts
        QA --> Executor: Revisions Needed
        QA --> Finished: Approval
    }

    Idle --> Job_Queued: User submits task
    Job_Queued --> Multi_Agent_Execution: SSE Connected
    Multi_Agent_Execution --> Idle: Stream Closed / DB Updated
```

### 4.2. Agent Roles
- **Planner Agent**: Analyzes complex tasks and breaks them down into actionable, sequential steps. It anticipates dependencies and edge cases.
- **Executor Agent**: The "doer." Takes the structured plan and performs the necessary implementation, script generation, or API calls.
- **QA / Self-Improve Agent**: An adversarial agent that evaluates the Executor's output for quality, correctness, and adherence to user-defined rules.

---

## 5. Memory, Context, and Retrieval-Augmented Generation (RAG)

To effectively manage 1M+ token windows, Virtual Me employs a sophisticated RAG architecture combined with explicit Skill management.

### 5.1. Context Assembly Flowchart

```mermaid
flowchart TD
    UserQuery[User Query / Task] --> DBFetch{Fetch Current Context}
    
    DBFetch --> Workspaces[(Workspace Document)]
    DBFetch --> Issues[(Active Issues)]
    
    UserQuery --> Embedder[Generate Query Embeddings]
    Embedder --> VectorDB[(Skill Vector Store)]
    
    VectorDB --> TopK[Cosine Similarity Top-K Match]
    
    TopK --> Assemble[Assemble Massive Prompt]
    Workspaces --> Assemble
    Issues --> Assemble
    
    Assemble --> GeminiModel((Gemini 1.5 Pro))
    GeminiModel --> FinalOutput[Agent Response]
```

### 5.2. Skill Management
The "Skill Manager" saves reusable prompts, architectural rules, and system instructions. Through vector embeddings (using `textEmbedding004`), the system dynamically retrieves relevant skills based on the current context, ensuring the AI agent adheres to the developer's specific coding guidelines without permanently bloating the system prompt.

---

## 6. Infrastructure & Deployment Details

### 6.1. Real-time Streaming & Server-Sent Events (SSE)
Unlike traditional REST APIs that timeout after 30-60 seconds, or WebSockets which require complex bi-directional state management, Virtual Me leverages **Server-Sent Events (SSE)**. 
- `X-Accel-Buffering: no` ensures that reverse proxies (like Nginx) do not buffer the AI's token stream, delivering a typing-like experience directly to the React frontend.
- `Connection: keep-alive` prevents premature termination during deep-thinking phases of the Planner Agent.

### 6.2. Firebase Firestore over SQLite
The migration from local SQLite to Firebase Firestore was driven by:
1. **Concurrency**: Multiple agents can read/write to the workspace state simultaneously without locking the database.
2. **Real-time Listeners**: React can natively subscribe to Firestore snapshot changes, ensuring the UI reflects the backend state instantly even if the browser is refreshed mid-job.

### 6.3. GitHub Synchronization
Virtual Me maintains the ability to push and pull the workspace state to a personal GitHub repository, providing an additional layer of version control and cross-device synchronization via the `Octokit` API.

---

## 7. Future Roadmap and Conclusion

Virtual Me represents the next generation of personal developer workspaces. By treating the workspace not as a static repository of files, but as a living, breathing context environment monitored by autonomous agents, developers can tackle significantly larger cognitive loads.

**Upcoming Features:**
- **Local LLM Fallback**: Integration with Ollama for offline, localized agent execution.
- **Expanded Tool Integrations**: Giving the Executor Agent direct file-system access (read/write) within sandboxed Docker containers.
- **Agentic Memory Compaction**: Background jobs that periodically summarize and compress historical issues into dense vector embeddings to preserve the primary context window.

By fusing a structured task and context manager with powerful, autonomous AI agents, Virtual Me evolves beyond a simple to-do list or wiki. It acts as a localized digital twin, actively assisting in planning, executing, and documenting workflows.
