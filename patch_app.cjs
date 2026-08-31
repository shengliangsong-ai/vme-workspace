const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('motion/react')) {
  code = code.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';");
  
  const originalMain = `        <main className="flex-1 h-full overflow-y-auto bg-[#f9f9f9]">\n          {currentTab === 'dashboard' && <Dashboard setCurrentTab={setCurrentTab} />}\n          {currentTab === 'workspace' && <Workspace />}\n          {currentTab === 'skills' && <SkillsManager />}\n          {currentTab === 'standups' && <StandupManager />}\n          {currentTab === 'blog' && <BlogManager />}\n          {currentTab === 'settings' && <SettingsView />}\n          {currentTab === 'teams' && <VirtualTeams />}\n          {currentTab === 'queue' && <QueueManager />}\n          {currentTab === 'demo' && <SelfDemo />}\n        </main>`;
  
  const animatedMain = `        <main className="flex-1 h-full overflow-hidden bg-[#f9f9f9] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto w-full absolute inset-0"
            >
              {currentTab === 'dashboard' && <Dashboard setCurrentTab={setCurrentTab} />}
              {currentTab === 'workspace' && <Workspace />}
              {currentTab === 'skills' && <SkillsManager />}
              {currentTab === 'standups' && <StandupManager />}
              {currentTab === 'blog' && <BlogManager />}
              {currentTab === 'settings' && <SettingsView />}
              {currentTab === 'teams' && <VirtualTeams />}
              {currentTab === 'queue' && <QueueManager />}
              {currentTab === 'demo' && <SelfDemo />}
            </motion.div>
          </AnimatePresence>
        </main>`;
  
  code = code.replace(originalMain, animatedMain);
  fs.writeFileSync('src/App.tsx', code);
}
