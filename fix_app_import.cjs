const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
if (!code.includes("import { motion, AnimatePresence } from 'motion/react';")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';");
  fs.writeFileSync('src/App.tsx', code);
}
