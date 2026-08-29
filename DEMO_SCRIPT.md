# Virtual Me (VME) - Demo Video Script (4 Minutes)

This document outlines the workflow and script for recording your 4-minute submission video for the **All Things Agentic Hackathon**. It ensures you highlight all the key features and hit the criteria for **Bonus Points**.

## Bonus Points Addressed:
1. **Multi-Agent Architecture**: We showcase three distinct agents (Planner, Executor, Evaluator) collaborating to solve tasks.
2. **Human-in-the-Loop (HITL)**: Crucial for production agentic systems. We demonstrate the Planner agent pausing for user approval before the Executor takes action.
3. **Self-Improvement / Reflection**: The Evaluator agent analyzes past executions to autonomously generate new "Skills" for the system, allowing the agents to learn over time.

---

## Video Script & Workflow

### 1. Introduction (0:00 - 0:30)
*   **Action:** Start on the **Dashboard** tab.
*   **Voiceover:** "Welcome to Virtual Me (VME), an AI-powered personal developer workspace. VME is designed to act as your autonomous coding assistant, managing issues, tracking standups, and running background jobs. It uses a robust Multi-Agent architecture powered by Gemini to automate complex tasks while keeping you in complete control."

### 2. Context & Issues (0:30 - 1:00)
*   **Action:** Click on the **Workspace (Issues)** tab. Show the current issues or create a quick mock issue (e.g., "Refactor database schema"). Click on the **Skills** tab briefly to show existing knowledge.
*   **Voiceover:** "Standard AI models have limited context windows. VME solves this by maintaining long-term memory through Issues, Skills, and persistent logs. This provides our agents with the rich, deep context they need to make intelligent decisions that align perfectly with our specific project's history."

### 3. Multi-Agent Orchestration: The Planner (1:00 - 2:00)
*   **Action:** Go to the **Queue (qsub)** tab. Click the **"Demo: Orchestrate"** button.
*   **Voiceover:** "Let's see the multi-agent system in action. I'm submitting an orchestration job to redesign our database schema. Instead of just blind execution, VME routes this to our **Planner Agent**. The Planner analyzes the request, fetches deep context from our workspace, and formulates a step-by-step execution plan."
*   **Action:** Wait for the plan to stream in. Point out the `Awaiting Approval` status (yellow pulsing icon).
*   **Voiceover:** "Notice that the job is now 'Awaiting Approval'. This is our **Human-in-the-Loop** safety mechanism. As developers, we review the agent's proposed plan before any destructive actions or complex code generation takes place."

### 4. Execution (2:00 - 2:45)
*   **Action:** Click the green **"Approve"** button on the job.
*   **Voiceover:** "Once I approve the plan, the job is handed off to the **Executor Agent**. The Executor takes the exact approved plan and begins generating the code and performing the necessary steps. You can see the logs streaming back in real-time as the agent works autonomously."
*   **Action:** Show the real-time logs updating in the UI.

### 5. Self-Improvement & Personalized Skills (2:45 - 3:30)
*   **Action:** Once the execution is complete, click the **"Run Self-Improvement"** button.
*   **Voiceover:** "What makes VME truly agentic is its ability to learn and fine-tune itself to you as an individual. Every day, the Evaluator Agent reviews your daily activity and execution logs, identifies what went right or wrong, and builds personalized skills."
*   **Action:** Watch the Evaluator generate the JSON. Then navigate to the **Skills** tab.
*   **Voiceover:** "The Evaluator automatically saves these learned skills and memories to the database. Through this continuous self-evaluation, your Virtual Me gets smarter and better over time—creating a highly personalized, fine-tuned context for future execution."

### 6. Conclusion & Future Vision (3:30 - 4:00)
*   **Action:** Switch to the **Blog & Lessons Learned** tab, explicitly highlighting the "Welcome Judges (4-min read)" post which contains the Vision section and Architecture diagram.
*   **Voiceover:** "In summary, Virtual Me automates development safely and continuously improves itself. But our long-term vision is much bigger. Virtual Me is designed to become the global standard for 'Smart Context'—an integral extension to top-tier AI models. Using a 2 Million token window is expensive. Virtual Me cuts costs by dynamically routing only relevant history into a cheaper 200K 'hot token' window. And because 1 Million tokens is just 4 Megabytes of data, attaching a simple 10-Gigabyte database gives our model 2.5 Billion tokens of persistent memory. We aren't just scaling up 1000x—we are providing virtually unlimited, cost-effective smart context. Thank you for watching!"

---

## Pre-Recording Checklist
1. **Ensure API Key is set:** Make sure `GEMINI_API_KEY` is in your `.env` file and the backend is running without errors.
2. **Clear old jobs:** You might want to delete old jobs from the Queue to make the UI look clean for the demo.
3. **Practice the timing:** Run through the sequence once without recording to ensure the agents respond within the expected timeframes (usually 10-20 seconds per agent step).
