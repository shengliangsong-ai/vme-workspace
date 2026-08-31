const http = require('http');

const state = {
  standups: [
    {
      id: "standup-2",
      date: "2026-08-30",
      today: "Populated mock data for standups and active workspace to prepare for the final demo pitch.",
      tomorrow: "Record the demo video and finalize the Virtual Teams instantiation workflows.",
      blockers: "None. Memory bank sync is stable.",
      createdAt: Date.now()
    },
    {
      id: "standup-1",
      date: "2026-08-29",
      today: "Optimized payload assets by resizing PNGs and converting to JPGs to fix Cloud Run deployment issues.",
      tomorrow: "Integrate Human-in-the-loop safety approvals into the CI/CD pipeline.",
      blockers: "Cloud Run upload limit was hitting RESOURCE_EXHAUSTED.",
      createdAt: Date.now() - 86400000
    }
  ],
  issues: [
    {
      id: "issue-1",
      title: "Implement Multi-Agent Synchronization",
      description: "We need the Planner, Executor, and QA agents to share the same local SQLite context block during execution. Right now they are overwriting each other's state.",
      createdAt: Date.now() - 100000,
      updatedAt: Date.now(),
      status: 'open',
      type: 'feature',
      steps: [
        { id: "step-1-1", title: "Define agent roles and context boundaries", isCompleted: true, content: "Roles defined in `VirtualTeams.tsx`." },
        { id: "step-1-2", title: "Create shared memory bank schema", isCompleted: false, content: "" },
        { id: "step-1-3", title: "Implement pub/sub for agent communication", isCompleted: false, content: "" }
      ],
      linkedSkills: ["skill-1"],
      contextSummary: "The agents are instantiated correctly but lack a unified memory context."
    },
    {
      id: "issue-2",
      title: "Memory limit exceeded on RAG Context Assembly",
      description: "When generating the context summary for large workspaces (>2GB), the Evaluator Agent throws a memory heap error.",
      createdAt: Date.now() - 200000,
      updatedAt: Date.now(),
      status: 'open',
      type: 'bug',
      steps: [
        { id: "step-2-1", title: "Analyze Node.js heap dump", isCompleted: true, content: "Found a memory leak in the markdown parser." },
        { id: "step-2-2", title: "Implement chunking for markdown files", isCompleted: false, content: "" },
        { id: "step-2-3", title: "Test against 10GB dataset in Firestore NoSQL", isCompleted: false, content: "" }
      ],
      linkedSkills: ["skill-2"],
      contextSummary: "We can probably use the same asset optimization strategy for RAG text chunks."
    }
  ],
  blogPosts: [
    {
      id: "blog-1",
      title: "Resolving the 'Status {2}' Publish Error: A Tale of Asset Optimization",
      content: "### The Incident\nToday, while attempting to publish the Virtual Me application to the Cloud Run preview environment, the system encountered a fatal deployment failure. The build crashed during the upload phase, returning a cryptic gRPC error in the Cloud Audit Logs:\n\n```json\n{\n  \"methodName\": \"/Services.UpdateService\",\n  \"status\": { \"code\": 2 },\n  \"severity\": \"ERROR\"\n}\n```\n\nA `status code 2` usually translates to `UNKNOWN` or `RESOURCE_EXHAUSTED`. In the context of Cloud Run and Cloud Build source deployments, this is the classic signature of an **oversized payload**.\n\n### The Investigation & Failures\nVirtual Me immediately sprang into action. By leveraging our local terminal access, we ran a simple disk usage check (`du -sh .`). The result was staggering: The workspace had ballooned to **1.1 Gigabytes**.\n\nThe pitch presentation slides we added were high-resolution PNGs (3410x1898 pixels) and duplicated across three directories (`PA/`, `PT/`, and `public/`). We also had `__MACOSX/` artifacts.\n\n### Attempted Resolutions\n1. **Removing Duplicates**: We deleted the unused `PA/` and `PT/` root directories and the hidden `__MACOSX/` directory. Result: `public/` folder alone was still **72 Megabytes**.\n2. **Shrinking PNGs**: We used ImageMagick (`mogrify -resize 1280x`) to shrink all `.png` files. Result: Reduced to **18MB**. However, raw PNG data was still unoptimized.\n3. **Format Conversion (Ultimate Fix)**: We converted every PNG file into highly compressed `JPEG` formats at 80% quality. We ran a regex `sed` script across the React codebase (`SelfDemo.tsx`) to update all image references from `.png` to `.jpg`, and safely purged the old `.png` files.\n\n### The Final Results\n- **Workspace Size**: ~1.1 GB -> ~800 MB (mostly node_modules)\n- **Public Assets Size**: ~72.0 MB -> **2.7 MB**\n- **Source Zip Payload**: > 100 MB -> **< 10 MB**\n- **Publish Status**: `RESOURCE_EXHAUSTED` -> **SUCCESS**\n\n### Conclusion\nThis is a textbook example of how Virtual Me functions. We didn't wait for human intervention. The VME orchestrator analyzed the error, formed a hypothesis, instantiated terminal tools to verify the theory, executed a multi-step remediation plan, and automatically refactored the UI codebase to match.",
      author: "VME Orchestrator",
      labels: ["infrastructure", "optimization", "post-mortem"],
      createdAt: Date.now()
    }
  ],
  skills: [
    {
      id: "skill-2",
      name: "Publish Payload Asset Optimization",
      description: "Automatically detects, resizes, and converts large media assets to prevent RESOURCE_EXHAUSTED publish errors.",
      content: "### Context\nWhen deploying or publishing projects via Google Cloud Build, there are strict payload size limits. High-resolution raw image formats (PNGs) and unused metadata directories (`__MACOSX`) can quickly bloat the workspace beyond the 100MB threshold, resulting in fatal `status {2}` or `RESOURCE_EXHAUSTED` errors.\n\n### Execution Steps\n1. **Diagnosis**: Run `du -sh .` and `du -sh public/`. If it exceeds 100MB (excluding node_modules), asset optimization is required.\n2. **Clean Artifacts**: Delete unused metadata: `rm -rf __MACOSX/`\n3. **Format Conversion**: Convert PNGs to JPEGs (JPEGs offer vastly superior compression). `mogrify -format jpg -quality 80 -resize 1280x public/*.png`\n4. **Codebase Refactoring**: Ensure the application code points to the newly compressed files. `sed -i 's/\\.png\"/\\.jpg\"/g' src/components/SelfDemo.tsx`\n5. **Cleanup**: Remove the heavy `.png` files. `find public -type f -name \"*.png\" -delete`",
      tags: ["deployment", "image-processing", "optimization", "memory-lesson"],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  jobs: [
    {
      id: "job-1",
      command: "npm run build && npm run test",
      status: "completed",
      log: "vite v6.4.3 building for production...\n✓ 4375 modules transformed.\n✓ built in 19.90s\nTests passed.",
      createdAt: Date.now() - 300000,
      completedAt: Date.now() - 250000
    },
    {
      id: "job-2",
      command: "Deploying VME agents to production",
      status: "queued",
      log: "Waiting for approval...",
      createdAt: Date.now() - 5000
    }
  ],
  settings: {
    githubToken: '',
    githubRepo: 'shengliangsong-ai/vme',
    claudeApiKey: ''
  },
  activeIssueId: "issue-1"
};

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/state',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(JSON.stringify(state));
req.end();
