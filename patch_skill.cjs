const fs = require('fs');
const dbPath = '.local-db.json';
if (fs.existsSync(dbPath)) {
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let state = db["workspaces/default"];
  if (state && state.skills) {
    let skill = state.skills.find(s => s.name === "Publish Payload Asset Optimization");
    if (skill) {
      skill.content = `## 👤 Part 1: Human Context & Reasoning (The "Why")\nWhen deploying or publishing projects to containerized environments (like Cloud Run), payload sizes are strictly capped. High-resolution raw image formats (PNGs), uncompressed media, and hidden metadata directories (like \`__MACOSX\` or \`.DS_Store\`) silently bloat the workspace. This causes the initial source-code upload to time out, resulting in a fatal \`status {2}\` or \`RESOURCE_EXHAUSTED\` error.\n\n**Lesson:** Always compress assets at the source before deploying. Raw design files should never be served in production.\n\n---\n\n## 🤖 Part 2: AI Execution Protocol (The "How" / Machine Directives)\n*Agent Instructions: If the user encounters a deployment timeout or a payload size error, execute the following strict sequence of terminal commands.*\n\n### Step 1: Payload Diagnosis\nRun disk usage checks to identify the bloat (excluding \`node_modules\`):\n\`\`\`bash\ndu -sh .\ndu -sh public/\n\`\`\`\n\n### Step 2: Purge Invisible Artifacts\nRemove OS-specific metadata files that have no place in a production build:\n\`\`\`bash\nrm -rf __MACOSX/\nfind . -name ".DS_Store" -delete\n\`\`\`\n\n### Step 3: Format Conversion & Compression\nUse ImageMagick to convert lossless formats to lossy, web-optimized formats. Resize any image wider than 1280px.\n\`\`\`bash\nmogrify -format jpg -quality 80 -resize 1280x public/*.png\n\`\`\`\n\n### Step 4: Codebase Synchronization\nUse \`sed\` or AST tools to update codebase references. *Crucial: Verify the file extensions in the source code.*\n\`\`\`bash\nsed -i 's/\\.png"/\\.jpg"/g' src/components/SelfDemo.tsx\n\`\`\`\n\n### Step 5: Verification & Cleanup\nDelete the old raw assets, verify the new folder size, and test the build.\n\`\`\`bash\nfind public -type f -name "*.png" -delete\ndu -sh public/\nnpm run build\n\`\`\``;
    }
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
