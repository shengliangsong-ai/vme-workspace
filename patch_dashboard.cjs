const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const rechartsImports = `import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';\n`;

if (!code.includes('recharts')) {
    code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + rechartsImports);
    
    const mockChartData = `
const tokenData = [
  { time: '10:00', tokens: 1200 },
  { time: '11:00', tokens: 3500 },
  { time: '12:00', tokens: 2800 },
  { time: '13:00', tokens: 8400 },
  { time: '14:00', tokens: 5100 },
  { time: '15:00', tokens: 10200 },
  { time: '16:00', tokens: 7500 },
];
const jobData = [
  { name: 'Success', value: 45, color: '#22c55e' },
  { name: 'Failed', value: 3, color: '#ef4444' },
  { name: 'Cancelled', value: 12, color: '#94a3b8' }
];
`;

    code = code.replace("export function Dashboard({ setCurrentTab }: DashboardProps) {", mockChartData + "\nexport function Dashboard({ setCurrentTab }: DashboardProps) {");

    const chartHtml = `
      {/* Executive Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#eeeeee] p-5 rounded-xl shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Token Burn Rate (Daily)</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #eee', fontSize: '12px' }} />
                <Area type="monotone" dataKey="tokens" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white border border-[#eeeeee] p-5 rounded-xl shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Job Execution Status</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} width={80} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #eee', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {jobData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
`;
    
    code = code.replace(
      `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">`,
      chartHtml + `\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">`
    );

    fs.writeFileSync('src/components/Dashboard.tsx', code);
}
