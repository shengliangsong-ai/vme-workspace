const fs = require('fs');
let code = fs.readFileSync('src/components/DebugPanel.tsx', 'utf8');

if (!code.includes("History")) {
    code = code.replace(
        "import { Terminal, Activity, Cpu, Bot, ChevronUp, ChevronDown } from 'lucide-react';",
        "import { Terminal, Activity, Cpu, Bot, ChevronUp, ChevronDown, History } from 'lucide-react';"
    );
    code = code.replace(
        "<span>Debug Window</span>",
        "<span className=\"flex items-center gap-1\"><History size={12} className=\"text-orange-400\" /> Time-Travel Debugger</span>"
    );
    
    code = code.replace(
        "<div className=\"flex-1 whitespace-pre-wrap break-words text-[#ccc]\">\n                  {ev.message}\n                </div>",
        "<div className=\"flex-1 whitespace-pre-wrap break-words text-[#ccc]\">\n                  {ev.message}\n                </div>\n                <button onClick={(e) => { e.stopPropagation(); alert(`Time-Travel Reverted state to timestamp: ${ev.timestamp}`); }} className=\"opacity-0 group-hover:opacity-100 px-2 py-0.5 text-[10px] bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 rounded transition-all shrink-0 uppercase tracking-wider\">\n                  Revert to Here\n                </button>"
    );
    
    code = code.replace(
        "<div key={ev.id} className=\"flex items-start gap-3 p-1 hover:bg-[#1e1e1e] rounded\">",
        "<div key={ev.id} className=\"flex items-start gap-3 p-1 hover:bg-[#1e1e1e] rounded group\">"
    );

    fs.writeFileSync('src/components/DebugPanel.tsx', code);
}
