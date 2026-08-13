import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { SettingsView } from './components/Settings';
import { Workspace } from './components/Workspace';
import { SkillsManager } from './components/SkillsManager';
import { Dashboard } from './components/Dashboard';
import { QueueManager } from './components/QueueManager';
import { StandupManager } from './components/StandupManager';
import { BlogManager } from './components/BlogManager';
import { CommandTerminal } from './components/CommandTerminal';
import { DebugPanel } from './components/DebugPanel';

function MainLayout() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fdfdfd] text-[#1a1a1a] font-sans">
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-32px)] pb-[32px]">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 h-full overflow-y-auto bg-[#f9f9f9]">
          {currentTab === 'dashboard' && <Dashboard setCurrentTab={setCurrentTab} />}
          {currentTab === 'workspace' && <Workspace />}
          {currentTab === 'skills' && <SkillsManager />}
          {currentTab === 'standups' && <StandupManager />}
          {currentTab === 'blog' && <BlogManager />}
          {currentTab === 'settings' && <SettingsView />}
          {currentTab === 'queue' && <QueueManager />}
        </main>
      </div>
      <CommandTerminal currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <DebugPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
