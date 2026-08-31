const fs = require('fs');
let code = fs.readFileSync('src/components/SkillsManager.tsx', 'utf8');

if (!code.includes("react-markdown")) {
    code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport Markdown from 'react-markdown';\nimport remarkGfm from 'remark-gfm';");
    code = code.replace("import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';", "import { Plus, Trash2, Edit2, Save, X, Eye } from 'lucide-react';");
    
    // Add view state
    code = code.replace("const [isCreating, setIsCreating] = useState(false);", "const [isCreating, setIsCreating] = useState(false);\n  const [viewingSkill, setViewingSkill] = useState<any>(null);");
    
    // Add View Modal UI
    const modalHtml = `
      {viewingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-[#eeeeee]">
              <div>
                <h3 className="text-xl font-semibold text-[#1a1a1a]">{viewingSkill.name}</h3>
                <div className="flex gap-2 mt-2">
                  {viewingSkill.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-[#f0f0f0] text-[#666666] px-2 py-0.5 rounded border border-[#e5e5e5]">{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setViewingSkill(null)} className="text-[#999999] hover:text-[#1a1a1a]">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 prose prose-sm max-w-none prose-headings:text-[#1a1a1a] prose-a:text-blue-600">
              <Markdown remarkPlugins={[remarkGfm]}>{viewingSkill.content}</Markdown>
            </div>
          </div>
        </div>
      )}
`;
    
    code = code.replace("{skills.map(skill => (", modalHtml + "\n        {skills.map(skill => (");

    // Add Eye icon to actions
    code = code.replace(
        "<button \n                  onClick={() => {\n                    setEditingId(skill.id);",
        "<button \n                  onClick={() => setViewingSkill(skill)}\n                  className=\"text-[#999999] hover:text-green-600 p-1\"\n                  title=\"View Skill\"\n                >\n                  <Eye size={16} />\n                </button>\n                <button \n                  onClick={() => {\n                    setEditingId(skill.id);"
    );

    fs.writeFileSync('src/components/SkillsManager.tsx', code);
}
