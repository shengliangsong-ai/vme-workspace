const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

if (!code.includes("Dual-Storage")) {
    const storageHtml = `
        <div className="bg-white p-6 rounded-xl border border-[#eeeeee] shadow-sm">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Dual-Storage Architecture (Memory Bank)</h3>
          <p className="text-sm text-[#666666] mb-6">
            Virtual Me employs a dual-storage bridge to align human memory with the AI context window.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Active</div>
              <h4 className="font-semibold text-green-900 mb-1">Local SQLite</h4>
              <p className="text-xs text-green-800/80">Hot active memory. Extremely fast localized context tailored for current standups and active planner tasks.</p>
            </div>
            
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Connected</div>
              <h4 className="font-semibold text-blue-900 mb-1">Firestore NoSQL</h4>
              <p className="text-xs text-blue-800/80">Long-term global memory bank. Enables 10GB+ searchable tokens for RAG Context Assembly across sessions.</p>
            </div>
          </div>
        </div>
`;
    
    code = code.replace(
        "<div className=\"space-y-6\">",
        "<div className=\"space-y-6\">\n" + storageHtml
    );
    
    fs.writeFileSync('src/components/Settings.tsx', code);
}
