import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // Default model
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize Firebase Admin
  let db: FirebaseFirestore.Firestore;
  if (fs.existsSync('./firebase-applet-config.json')) {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
    const firebaseApp = initializeApp({
      credential: applicationDefault(),
      projectId: config.projectId
    });
    db = getFirestore(firebaseApp, config.firestoreDatabaseId || '(default)');
  } else {
    throw new Error("Missing firebase-applet-config.json");
  }

  // API Routes
  app.get("/api/state", async (req, res) => {
    try {
      const docRef = db.collection('workspaces').doc('default');
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        const initialState = {
          issues: [],
          skills: [],
          jobs: [],
          standups: [],
          blogPosts: [],
          sessionReports: [],
          settings: {}
        };
        await docRef.set(initialState);
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
      const docRef = db.collection('workspaces').doc('default');
      await docRef.set(req.body);
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
