import React, { useEffect, useState, useRef } from 'react';
import { Plus, Search, Image as ImageIcon, LayoutGrid, PlusSquare, History, Settings, Activity, User, ShieldCheck, Database, LogOut, ChevronRight, UserCircle, MessageSquare, HelpCircle, Keyboard, FileText } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { SearchChatModal } from './SearchChatModal';
import { ShortcutsModal } from './ShortcutsModal';
import { loadChatHistory } from '../firebase';

interface SidebarProps {
  sessionId: string;
  userId?: string;
  onHistoryClick?: (item: any) => void;
  onNewChat?: () => void;
  refreshTrigger?: number;
  userName?: string;
  userPhoto?: string | null;
}

interface HistoryItem {
  query: string;
  timestamp: number;
  report?: string;
}

export function Sidebar({ sessionId, userId, onHistoryClick, onNewChat, refreshTrigger = 0, userName, userPhoto }: SidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSearchChat, setShowSearchChat] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      loadChatHistory(userId)
        .then(data => {
          setHistory(data);
        })
        .catch(console.error);
    }
  }, [userId, refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea elements
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        const enabled = localStorage.getItem('rm_sc_search_chats') !== 'false';
        if (enabled) {
          e.preventDefault();
          setShowSearchChat(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-[#222] bg-slate-50 dark:bg-[#111111] flex flex-col p-4 h-full font-sans text-sm transition-colors duration-300">
      
      {/* Top Menu Actions */}
      <div className="space-y-2 mb-6 mt-2">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-slate-200/50 hover:bg-slate-200 dark:bg-[#1E1E1E] dark:hover:bg-[#2A2A2A] text-slate-800 dark:text-zinc-200 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          New chat
        </button>
        <button 
          onClick={() => setShowSearchChat(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-[#1E1E1E] text-slate-700 dark:text-zinc-300 transition-colors text-sm"
        >
          <Search size={18} />
          Search chats
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <p className="px-4 text-[11px] font-semibold text-slate-500 dark:text-zinc-500 mb-2">Recents</p>
        <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
          {history.length === 0 ? (
            <div className="px-4 py-2 text-slate-400 dark:text-zinc-500 text-xs">No recent chats.</div>
          ) : (
            history.map((item, i) => (
              <div 
                key={i} 
                onClick={() => onHistoryClick && onHistoryClick(item)}
                className="py-2.5 px-4 rounded-lg hover:bg-slate-200/50 dark:hover:bg-[#1E1E1E] cursor-pointer text-slate-700 dark:text-zinc-300 truncate transition-colors text-xs"
              >
                {item.query}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#2A2A2A] relative" ref={settingsRef}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             {userPhoto ? (
               <img src={userPhoto} referrerPolicy="no-referrer" alt={userName || 'User'} className="w-8 h-8 rounded-full shadow-sm object-cover" />
             ) : (
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm font-semibold text-[10px]">
                 {userName ? userName.slice(0, 2).toUpperCase() : <UserCircle className="w-6 h-6 opacity-75" />}
               </div>
             )}
             <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 tracking-wide uppercase truncate max-w-[120px]">
               {userName || 'RESEARCHER'}
             </span>
          </div>
          <button 
             onClick={() => setShowSettings(!showSettings)}
             className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-[#2A2A2A] flex items-center justify-center text-slate-600 dark:text-zinc-400 transition-colors"
          >
             <Settings size={18} className={`${showSettings ? "text-indigo-500" : ""}`} />
          </button>
        </div>

        {/* Settings Popup Menu */}
        {showSettings && (
           <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] shadow-xl rounded-xl py-2 z-50">
             <button 
               onClick={() => {
                 setShowSettings(false);
                 setShowFeedback(true);
               }}
               className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] text-slate-700 dark:text-zinc-200 text-sm transition-colors text-left"
             >
               <MessageSquare size={16} /> Send feedback
             </button>
             
             <button 
               onClick={() => {
                 setShowSettings(false);
                 setShowShortcuts(true);
               }}
               className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] text-slate-700 dark:text-zinc-200 text-sm transition-colors text-left"
             >
               <Keyboard size={16} /> Keyboard shortcuts
             </button>

             <a 
               href="/terms.html" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] text-slate-700 dark:text-zinc-200 text-sm transition-colors text-left"
             >
               <FileText size={16} /> Terms of Service
             </a>

             <div className="h-px bg-slate-200 dark:bg-[#333] my-2"></div>
             <button 
                onClick={() => {
                   localStorage.removeItem('rm_logged_in');
                   localStorage.removeItem('rm_user_name');
                   localStorage.removeItem('rm_user_photo');
                   localStorage.removeItem('rm_user_id');
                   window.location.reload();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 text-sm transition-colors text-left"
             >
               <LogOut size={16} /> Log Out
             </button>
           </div>
        )}
      </div>
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
      {showSearchChat && (
        <SearchChatModal 
          onClose={() => setShowSearchChat(false)} 
          history={history}
          onSelectChat={(item) => {
            if (onHistoryClick) onHistoryClick(item);
          }}
        />
      )}
    </aside>
  );
}
