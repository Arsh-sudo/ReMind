import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResearchInterface } from './components/ResearchInterface';
import { Brain, Sun, Moon, Search, BrainCircuit, LineChart, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { LoginScreen } from './components/LoginScreen';
import { AppLogo } from './components/AppLogo';
import { saveChatHistory } from './firebase';
import { ParticleBackground } from './components/ParticleBackground';

// Generate a random stable session ID
const generateSessionId = () => Math.random().toString(36).substring(2, 9);

export default function App() {
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('rm_session_id');
    if (saved) return saved;
    const newId = generateSessionId();
    localStorage.setItem('rm_session_id', newId);
    return newId;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('rm_sidebar_open') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('rm_sidebar_open', isSidebarOpen ? 'true' : 'false');
  }, [isSidebarOpen]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [activeHistoryItem, setActiveHistoryItem] = useState<any>(null);
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('rm_logged_in') === 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('rm_user_name') || 'Researcher';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('rm_user_id') || '';
  });
  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    return localStorage.getItem('rm_user_photo') || null;
  });

  const handleLogin = (name: string, photoUrl: string | null, uid: string) => {
    localStorage.setItem('rm_logged_in', 'true');
    localStorage.setItem('rm_user_name', name);
    localStorage.setItem('rm_user_id', uid);
    if (photoUrl) {
      localStorage.setItem('rm_user_photo', photoUrl);
    } else {
      localStorage.removeItem('rm_user_photo');
    }
    setUserName(name);
    setUserPhoto(photoUrl);
    setUserId(uid);
    setIsLoggedIn(true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea elements
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Start New Chat (Alt + N)
      if (e.altKey && e.key.toLowerCase() === 'n') {
        const enabled = localStorage.getItem('rm_sc_new_chat') !== 'false';
        if (enabled) {
          e.preventDefault();
          setActiveHistoryItem(null);
        }
      }

      // Toggle Theme (Alt + T)
      if (e.altKey && e.key.toLowerCase() === 't') {
        const enabled = localStorage.getItem('rm_sc_toggle_theme') !== 'false';
        if (enabled) {
          e.preventDefault();
          toggleTheme();
        }
      }

      // Toggle Sidebar (Alt + M)
      if (e.altKey && e.key.toLowerCase() === 'm') {
        const enabled = localStorage.getItem('rm_sc_toggle_sidebar') !== 'false';
        if (enabled) {
          e.preventDefault();
          setIsSidebarOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifySynthesisComplete = useCallback(async (chatId: string | null, query: string, messages: {query: string, report: string}[]) => {
    if (userId) {
      const newChatId = await saveChatHistory(userId, chatId, query, messages, Date.now());
      setHistoryTrigger(prev => prev + 1);
      return newChatId;
    }
    return null;
  }, [userId]);

  if (!isLoggedIn) {
     return <LoginScreen onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
  }

  return (
    <div className={`${theme} flex h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-[#e0e0e0] font-sans flex-col overflow-hidden transition-colors duration-300`}>
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-[#222] px-4 md:px-8 flex items-center justify-between bg-white dark:bg-[#080808] shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3 group">
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A1A1A] text-slate-600 dark:text-zinc-400 hidden md:block transition-colors"
            title={isSidebarOpen ? "Minimize sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <AppLogo className="w-8 h-8 shadow-sm group-hover:scale-105 transition-transform" />
          <h1 className="text-xl font-bold tracking-widest uppercase hidden sm:block text-slate-900 dark:text-white">REMIND</h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
             onClick={toggleTheme}
             className="w-10 h-10 rounded-full border border-slate-200 dark:border-[#333] flex items-center justify-center bg-slate-100 dark:bg-[#111] hover:scale-105 transition-transform text-slate-600 dark:text-zinc-400"
          >
             {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        <ParticleBackground />
        <div className={`hidden md:flex relative z-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-72" : "w-0 opacity-0 overflow-hidden"}`}>
          <Sidebar 
            sessionId={sessionId} 
            userId={userId}
            onHistoryClick={setActiveHistoryItem} 
            refreshTrigger={historyTrigger}
            onNewChat={() => setActiveHistoryItem(null)}
            userName={userName}
            userPhoto={userPhoto}
          />
        </div>
        <section className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 transition-colors duration-300">
          <ResearchInterface 
            sessionId={sessionId} 
            historyItem={activeHistoryItem} 
            onSynthesisComplete={notifySynthesisComplete}
          />
        </section>

        

      </main>

      {/* Sub-footer */}
      <footer className="h-6 bg-white dark:bg-[#080808] border-t border-slate-200 dark:border-[#222] flex items-center px-4 justify-between shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 hover:scale-105 transition-transform">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase">Cloud Run Status: Nominal</span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-zinc-600 hidden sm:inline">|</span>
          <span className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase hidden sm:inline">Latency: 42ms</span>
        </div>
        <div className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase tracking-tighter">
          ReMind Intelligence System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

