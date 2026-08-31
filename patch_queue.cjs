const fs = require('fs');
let code = fs.readFileSync('src/components/QueueManager.tsx', 'utf8');

if (!code.includes('motion/react')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';");
  
  // Replace the jobs mapping div with motion.div
  code = code.replace(
    /                    <div \n                       key=\{job\.id\}/g,
    `                    <motion.div 
                       layout
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       key={job.id}`
  );
  
  code = code.replace(
    /                      <\/div>\n                    <\/div>/g,
    `                      </div>\n                    </motion.div>`
  );

  code = code.replace(
    `<div className="space-y-2">\n                  {jobs.map`,
    `<div className="space-y-2">\n                  <AnimatePresence>\n                  {jobs.map`
  );

  code = code.replace(
    `                  ))}                </div>`,
    `                  )}\n                  </AnimatePresence>\n                </div>`
  );

  fs.writeFileSync('src/components/QueueManager.tsx', code);
}
