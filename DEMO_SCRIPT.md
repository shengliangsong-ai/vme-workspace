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
*   **Voiceover:** "Welcome to Virtual Me (VME), an agentic developer workspace. VME is designed to act as your autonomous coding assistant, managing issues, tracking standups, and running background jobs. It uses a robust Multi-Agent architecture powered by Gemini to automate complex tasks while keeping you in control."

### 2. Context & Issues (0:30 - 1:00)
*   **Action:** Click on the **Workspace (Issues)** tab. Show the current issues or create a quick mock issue (e.g., "Refactor database schema"). Click on the **Skills** tab briefly to show existing knowledge.
*   **Voiceover:** "VME maintains long-term memory through Issues, Skills, and Blog posts. This provides our agents with the rich context they need to make intelligent decisions that align with our specific project."

### 3. Multi-Agent Orchestration: The Planner (1:00 - 2:00)
*   **Action:** Go to the **Queue (qsub)** tab. Click the **"Demo: Orchestrate"** button.
*   **Voiceover:** "Let's see the multi-agent system in action. I'm submitting an orchestration job to redesign our database schema. Instead of just blind execution, VME routes this to our **Planner Agent**. The Planner analyzes the request, fetches context from our workspace, and formulates a step-by-step execution plan."
*   **Action:** Wait for the plan to stream in. Point out the `Awaiting Approval` status (yellow pulsing icon).
*   **Voiceover:** "Notice that the job is now 'Awaiting Approval'. This is our **Human-in-the-Loop** safety mechanism. As developers, we review the agent's proposed plan before any destructive actions or complex code generation takes place."

### 4. Execution (2:00 - 2:45)
*   **Action:** Click the green **"Approve"** button on the job.
*   **Voiceover:** "Once I approve the plan, the job is handed off to the **Executor Agent**. The Executor takes the exact approved plan and begins generating the code and performing the necessary steps. You can see the logs streaming back in real-time as the agent works."
*   **Action:** Show the real-time logs updating in the UI.

### 5. Self-Improvement & Reflection (2:45 - 3:30)
*   **Action:** Once the execution is complete, click the **"Run Self-Improvement"** button.
*   **Voiceover:** "What makes VME truly agentic is its ability to learn. After a session of work, we can trigger the **Evaluator Agent**. The Evaluator reviews the execution logs of all recent jobs, identifies what went right or wrong, and extracts reusable knowledge."
*   **Action:** Watch the Evaluator generate the JSON. Then navigate to the **Skills** tab.
*   **Voiceover:** "The Evaluator automatically generates a new 'Skill' document based on its learnings and saves it to the database. Over time, VME builds a repository of auto-generated skills, improving the context for future planning and execution. Let's look at the new skill it just learned."

### 6. Conclusion (3:30 - 4:00)
*   **Action:** Switch back to the **Dashboard**.
*   **Voiceover:** "In summary, Virtual Me leverages a Planner, Executor, and Evaluator agent to automate development workflows safely with Human-in-the-loop approval, and continuously improves itself through reflection. Thanks for watching!"

---

## Pre-Recording Checklist
1. **Ensure API Key is set:** Make sure `GEMINI_API_KEY` is in your `.env` file and the backend is running without errors.
2. **Clear old jobs:** You might want to delete old jobs from the Queue to make the UI look clean for the demo.
3. **Practice the timing:** Run through the sequence once without recording to ensure the agents respond within the expected timeframes (usually 10-20 seconds per agent step).
