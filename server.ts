import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash, textEmbedding004 } from "@genkit-ai/googleai";
import { GoogleGenAI } from "@google/genai";

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Default model
});

let genai: GoogleGenAI;
if (process.env.GEMINI_API_KEY) {
  genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function ensureAgents() {
  if (!genai) return;
  try {
    const list = await genai.agents.list();
    const existingIds = list.agents?.map(a => a.id) || [];
    
    if (!existingIds.includes("vme-planner-agent")) {
      console.log("Creating Planner Agent...");
      await genai.agents.create({
        id: "vme-planner-agent",
        base_agent: "antigravity-preview-05-2026",
        system_instruction: "You are the Planner Agent. Your job is to break down the user's request into actionable steps. Do NOT write the code yourself. Only provide the plan for the Executor Agent.",
        base_environment: { type: "remote" }
      });
    }

    if (!existingIds.includes("vme-executor-agent")) {
      console.log("Creating Executor Agent...");
      await genai.agents.create({
        id: "vme-executor-agent",
        base_agent: "antigravity-preview-05-2026",
        system_instruction: "You are the Executor Agent. Your job is to follow the plan provided by the Planner Agent and execute the necessary commands to complete the task.",
        base_environment: { type: "remote" }
      });
    }

    if (!existingIds.includes("vme-qa-agent")) {
      console.log("Creating QA Reviewer Agent...");
      await genai.agents.create({
        id: "vme-qa-agent",
        base_agent: "antigravity-preview-05-2026",
        system_instruction: "You are the QA Reviewer Agent. Your job is to review the code or task completed by the Executor Agent and run necessary tests. If there are issues, report them. If everything looks good, approve the task.",
        base_environment: { type: "remote" }
      });
    }
    console.log("Custom agents verified.");
  } catch (err) {
    console.error("Failed to ensure custom agents:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  if (genai) {
    ensureAgents();
  }


  app.use(express.json({ limit: "50mb" }));

  // Initialize Firebase Client SDK
  let db: any;
  if (fs.existsSync('./firebase-applet-config.json')) {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
    const firebaseApp = initializeApp(config);
    db = getFirestore(firebaseApp, config.firestoreDatabaseId || '(default)');
  } else {
    throw new Error("Missing firebase-applet-config.json");
  }

  const searchWorkspaceData = ai.defineTool({
    name: 'searchWorkspaceData',
    description: 'Searches the workspace for relevant context (skills, issues, blog posts, etc.) using semantic similarity. Use this tool whenever you need context about the project, the developer, or past work to answer a question.',
    inputSchema: z.object({
      query: z.string().describe('The search query'),
    }),
    outputSchema: z.string().describe('Relevant context found'),
  }, async (input) => {
    try {
      const docRef = doc(db, 'workspaces', 'default');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return "No data found.";
      
      const state = docSnap.data();
      const searchableItems: { id: string, type: string, text: string }[] = [];

      if (state.skills) {
        for (const s of state.skills) searchableItems.push({ id: s.id, type: 'skill', text: `Skill: ${s.name}\nDescription: ${s.description}\nContent: ${s.content}` });
      }
      if (state.issues) {
        for (const i of state.issues) searchableItems.push({ id: i.id, type: 'issue', text: `Issue: ${i.title}\nDescription: ${i.description}` });
      }
      if (state.blogPosts) {
        for (const b of state.blogPosts) searchableItems.push({ id: b.id, type: 'blogPost', text: `Blog Post: ${b.title}\nContent: ${b.content}` });
      }

      if (searchableItems.length === 0) return "No searchable items found.";

      // Get embedding for query
      const queryEmbedRes = await ai.embed({
        embedder: textEmbedding004,
        content: input.query,
      });
      const queryVector = queryEmbedRes;

      // Check for cached embeddings
      const embeddingsDocRef = doc(db, 'workspaces', 'default_embeddings');
      let embeddingsSnap = await getDoc(embeddingsDocRef);
      let embeddingsData = embeddingsSnap.exists() ? embeddingsSnap.data().cache || {} : {};
      
      let updated = false;
      const results: { item: any, score: number }[] = [];

      for (const item of searchableItems) {
        let vector = embeddingsData[item.id]?.vector;
        if (!vector || embeddingsData[item.id]?.text !== item.text) {
          const itemEmbed = await ai.embed({
            embedder: textEmbedding004,
            content: item.text,
          });
          vector = itemEmbed;
          embeddingsData[item.id] = { text: item.text, vector };
          updated = true;
        }
        
        // Ensure vectors are arrays of numbers
        if (Array.isArray(queryVector) && Array.isArray(vector)) {
           // genkit embed output can be { embedding: [] } or just [] depending on version, wait...
           // Let's handle both
           const qVec = queryVector[0]?.embedding || queryVector;
           const iVec = vector[0]?.embedding || vector;
           if (Array.isArray(qVec) && Array.isArray(iVec)) {
             const score = cosineSimilarity(qVec, iVec);
             results.push({ item, score });
           }
        }
      }

      if (updated) {
        await setDoc(embeddingsDocRef, { cache: embeddingsData });
      }

      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, 3);
      
      if (topResults.length === 0) return "No relevant context found.";
      
      return topResults.map(r => `[${r.item.type.toUpperCase()}]\n${r.item.text}`).join('\n\n');
    } catch (err: any) {
      console.error("Tool error:", err);
      return `Error searching data: ${err.message}`;
    }
  });

  // API Routes
  app.get("/api/state", async (req, res) => {
    try {
      const docRef = doc(db, 'workspaces', 'default');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const initialState = {
          issues: [],
          skills: [],
          jobs: [],
          standups: [],
          blogPosts: [],
          sessionReports: [],
          settings: {}
        };
        await setDoc(docRef, initialState);
        res.json(initialState);
      } else {
        res.json(docSnap.data());
      }
    } catch (err) {
      console.error("Failed to load state", err);
      res.status(500).json({ error: "Failed to load state" });
    }
  });

  app.post("/api/state", async (req, res) => {
    try {
      const docRef = doc(db, 'workspaces', 'default');
      await setDoc(docRef, req.body);
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save state", err);
      res.status(500).json({ error: "Failed to save state" });
    }
  });

  // Genkit Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const response = await ai.generate({
        prompt: prompt,
        tools: [searchWorkspaceData],
      });

      res.json({ text: response.text });
    } catch (err) {
      console.error("Genkit chat error:", err);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Job Execution Endpoint (SSE)
  app.get("/api/jobs/stream", async (req, res) => {
    const { command } = req.query;
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: "Command is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      if (!genai) {
        genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      }
      const stream = await genai.interactions.create({
        agent: "antigravity-preview-05-2026",
        input: `Execute the following task or command: ${command}`,
        environment: "remote",
        stream: true,
      }, { timeout: 300000 });

      for await (const event of stream) {
        if (event.event_type === "step.delta" && event.delta.type === "text") {
          res.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`);
        } else if (event.event_type === "interaction.completed") {
          res.write(`data: ${JSON.stringify({ type: 'completed' })}\n\n`);
        }
      }
    } catch (err: any) {
      console.error("Job execution error:", err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    } finally {
      res.end();
    }
  });

  // Job Orchestration Endpoint (SSE)
  app.get("/api/jobs/orchestrate", async (req, res) => {
    const { command } = req.query;
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: "Command is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      if (!genai) {
        genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      }

      res.write(`data: ${JSON.stringify({ type: 'delta', text: `[Orchestrator] Starting multi-agent workflow for: ${command}\n\n` })}\n\n`);

      res.write(`data: ${JSON.stringify({ type: 'delta', text: `[Planner Agent] Planning...\n` })}\n\n`);
      const plannerRes = await genai.interactions.create({
        agent: "vme-planner-agent",
        input: `Plan the following task: ${command}`,
        environment: "remote"
      }, { timeout: 300000 });
      const plan = plannerRes.output_text || "";
      res.write(`data: ${JSON.stringify({ type: 'delta', text: `${plan}\n\n` })}\n\n`);

      res.write(`data: ${JSON.stringify({ type: 'awaiting_approval', plan: plan })}\n\n`);
    } catch (err: any) {
      console.error("Orchestration error:", err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    } finally {
      res.end();
    }
  });

  app.get("/api/jobs/execute", async (req, res) => {
    const { plan } = req.query;
    if (!plan || typeof plan !== 'string') {
      return res.status(400).json({ error: "Plan is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      if (!genai) {
        genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      }

      res.write(`data: ${JSON.stringify({ type: 'delta', text: `[Executor Agent] Executing plan...\n` })}\n\n`);
      const stream = await genai.interactions.create({
        agent: "vme-executor-agent",
        input: `Execute the following plan:\n${plan}`,
        environment: "remote",
        stream: true,
      }, { timeout: 300000 });

      let executionOutput = "";
      for await (const event of stream) {
        if (event.event_type === "step.delta" && event.delta.type === "text") {
          executionOutput += event.delta.text;
          res.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ type: 'delta', text: `\n\n[QA Reviewer Agent] Reviewing execution...\n` })}\n\n`);

      const qaRes = await genai.interactions.create({
        agent: "vme-qa-agent",
        input: `Review the following execution log for the plan:\n\nPlan:\n${plan}\n\nExecution:\n${executionOutput}`,
        environment: "remote"
      }, { timeout: 300000 });
      const qaOutput = qaRes.output_text || "";
      res.write(`data: ${JSON.stringify({ type: 'delta', text: `${qaOutput}\n\n` })}\n\n`);

      res.write(`data: ${JSON.stringify({ type: 'completed' })}\n\n`);
    } catch (err: any) {
      console.error("Execution error:", err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    } finally {
      res.end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
