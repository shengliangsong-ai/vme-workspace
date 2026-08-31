const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const importReplacement = `import { Users, LayoutDashboard, CheckSquare, BrainCircuit, Settings, Github, RefreshCw, ListTodo, Calendar, BookOpen, Terminal, PlayCircle, ExternalLink, Code } from 'lucide-react';`;
code = code.replace(/import { Users.*? } from 'lucide-react';/, importReplacement);

const newButtons = `
        <a
          href="https://github.com/shengliangsong-ai/vme-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-[#24292e] hover:bg-[#2f363d] rounded-md text-xs font-semibold transition-colors text-white shadow-sm"
        >
          <Github size={14} /> View GitHub Source
        </a>
        <a
          href="https://github1s.com/shengliangsong-ai/vme-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-[#f0f0f0] hover:bg-[#e5e5e5] rounded-md text-xs font-semibold transition-colors text-[#1a1a1a]"
        >
          <Code size={14} /> Read Source Code
        </a>
`;

code = code.replace(
  `        <button \n          onClick={() => window.dispatchEvent(new CustomEvent('toggle-terminal'))}`,
  newButtons + `\n        <button \n          onClick={() => window.dispatchEvent(new CustomEvent('toggle-terminal'))}`
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
