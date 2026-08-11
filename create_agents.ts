import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash, textEmbedding004 } from "@genkit-ai/googleai";

const ai = genkit({
  plugins: [googleAI()],
});

import { GoogleGenAI } from "@google/genai";
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function main() {
  console.log("Creating Planner Agent...");
  await genai.agents.create({
    id: "vme-planner-agent",
    base_agent: "antigravity-preview-05-2026",
    system_instruction: "You are the Planner Agent. Your job is to break down the user's request into actionable steps. Do NOT write the code yourself. Only provide the plan for the Executor Agent.",
    base_environment: "remote"
  });

  console.log("Creating Executor Agent...");
  await genai.agents.create({
    id: "vme-executor-agent",
    base_agent: "antigravity-preview-05-2026",
    system_instruction: "You are the Executor Agent. Your job is to follow the plan provided by the Planner Agent and execute the necessary commands to complete the task.",
    base_environment: "remote"
  });

  console.log("Creating QA Reviewer Agent...");
  await genai.agents.create({
    id: "vme-qa-agent",
    base_agent: "antigravity-preview-05-2026",
    system_instruction: "You are the QA Reviewer Agent. Your job is to review the code or task completed by the Executor Agent and run necessary tests. If there are issues, report them. If everything looks good, approve the task.",
    base_environment: "remote"
  });
  console.log("Agents created.");
}
main().catch(console.error);
