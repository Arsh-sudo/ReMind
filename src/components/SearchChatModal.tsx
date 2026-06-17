import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';

interface HistoryItem {
  query: string;
  timestamp: number;
  report?: string;
}

interface SearchChatModalProps {
  onClose: () => void;
  history: HistoryItem[];
  onSelectChat: (item: HistoryItem) => void;
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function SearchChatModal({ onClose, history, onSelectChat }: SearchChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item => 
    item.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm" id="search-modal-overlay" onClick={(e) => {
      if ((e.target as HTMLElement).id === 'search-modal-overlay') onClose();
    }}>
      <div className="w-full max-w-2xl bg-white dark:bg-[#111111] rounded-xl shadow-2xl border border-slate-200 dark:border-[#222] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-[#222] bg-slate-50 dark:bg-[#161616]">
          <Search className="text-slate-400 dark:text-zinc-500 w-5 h-5 ml-2" />
          <input
            type="text"
            placeholder="Search chats"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-zinc-200 px-4 py-2 placeholder-slate-400 dark:placeholder-zinc-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button 
             onClick={onClose}
             className="p-1 rounded-md text-slate-400 dark:text-zinc-500 hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors"
          >
             <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="px-4 text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-2 uppercase tracking-wider">
            {searchQuery ? 'Search Results' : 'Recent'}
          </div>
          
          <div className="space-y-1">
            {filteredHistory.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-zinc-500">
                No chats found matching "{searchQuery}"
              </div>
            ) : (
              filteredHistory.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    onSelectChat(item);
                    onClose();
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E1E1E] cursor-pointer group transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 truncate pr-4">
                    {item.query}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 whitespace-nowrap">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
