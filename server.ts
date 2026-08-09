import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash, textEmbedding004 } from "@genkit-ai/googleai";

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Default model
});

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

async function startServer() {
  const app = express();
  const PORT = 3000;

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
