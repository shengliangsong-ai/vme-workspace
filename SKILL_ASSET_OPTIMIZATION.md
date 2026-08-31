---
name: publish-asset-optimization
description: Automatically detects, resizes, and converts large media assets to prevent RESOURCE_EXHAUSTED publish errors.
tags: [deployment, image-processing, optimization, memory-lesson]
---

# Publish Payload Asset Optimization

## 👤 Part 1: Human Context & Reasoning (The "Why")
When deploying or publishing projects to containerized environments (like Cloud Run), payload sizes are strictly capped. High-resolution raw image formats (PNGs), uncompressed media, and hidden metadata directories (like `__MACOSX` or `.DS_Store`) silently bloat the workspace. This causes the initial source-code upload to time out, resulting in a fatal `status {2}` or `RESOURCE_EXHAUSTED` error.

**Lesson:** Always compress assets at the source before deploying. Raw design files should never be served in production.

---

## 🤖 Part 2: AI Execution Protocol (The "How" / Machine Directives)
*Agent Instructions: If the user encounters a deployment timeout or a payload size error, execute the following strict sequence of terminal commands.*

### Step 1: Payload Diagnosis
Run disk usage checks to identify the bloat (excluding `node_modules`):
```bash
du -sh .
du -sh public/
```

### Step 2: Purge Invisible Artifacts
Remove OS-specific metadata files that have no place in a production build:
```bash
rm -rf __MACOSX/
find . -name ".DS_Store" -delete
```

### Step 3: Format Conversion & Compression
Use ImageMagick to convert lossless formats to lossy, web-optimized formats. Resize any image wider than 1280px.
```bash
mogrify -format jpg -quality 80 -resize 1280x public/*.png
# (Extend this to .jpeg or .webp if applicable)
```

### Step 4: Codebase Synchronization
Use `sed` or AST tools to update codebase references. *Crucial: Verify the file extensions in the source code.*
```bash
sed -i 's/\.png"/\.jpg"/g' src/components/SelfDemo.tsx
```

### Step 5: Verification & Cleanup
Delete the old raw assets, verify the new folder size, and test the build.
```bash
find public -type f -name "*.png" -delete
du -sh public/
npm run build
```
