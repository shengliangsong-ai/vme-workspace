import express from "express";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize SQLite database
  const dbPath = path.join(process.cwd(), "vme.db");
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS state (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL
    )
  `);

  // Ensure there's a row
  const row = await db.get("SELECT data FROM state WHERE id = 1");
  if (!row) {
    await db.run("INSERT INTO state (id, data) VALUES (1, ?)", JSON.stringify({
      issues: [],
      skills: [],
      jobs: [],
      standups: [],
      blogPosts: [],
      sessionReports: [],
      settings: {}
    }));
  }

  // API Routes
  app.get("/api/state", async (req, res) => {
    try {
      const row = await db.get("SELECT data FROM state WHERE id = 1");
      res.json(JSON.parse(row.data));
    } catch (err) {
      console.error("Failed to load state", err);
      res.status(500).json({ error: "Failed to load state" });
    }
  });

  app.post("/api/state", async (req, res) => {
    try {
      await db.run("UPDATE state SET data = ? WHERE id = 1", JSON.stringify(req.body));
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save state", err);
      res.status(500).json({ error: "Failed to save state" });
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
