import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Keyboard, Check, ToggleLeft, ToggleRight, Layout, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  keys: string[];
}

interface ShortcutsModalProps {
  onClose: () => void;
}

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  // Enabled state of shortcuts, persist in localStorage
  const [enabledShortcuts, setEnabledShortcuts] = useState<Record<string, boolean>>(() => {
    return {
      new_chat: localStorage.getItem('rm_sc_new_chat') !== 'false',
      search_chats: localStorage.getItem('rm_sc_search_chats') !== 'false',
      toggle_theme: localStorage.getItem('rm_sc_toggle_theme') !== 'false',
      toggle_sidebar: localStorage.getItem('rm_sc_toggle_sidebar') !== 'false',
    };
  });

  const toggleShortcut = (id: string) => {
    const nextValue = !enabledShortcuts[id];
    setEnabledShortcuts(prev => ({
      ...prev,
      [id]: nextValue
    }));
    localStorage.setItem(`rm_sc_${id}`, nextValue ? 'true' : 'false');
  };

  const shortcutsList: ShortcutItem[] = [
    {
      id: 'new_chat',
      name: 'Start New Chat',
      description: 'Quickly clear the workbench and start a new synthesis thread.',
      keys: ['Alt', 'N']
    },
    {
      id: 'search_chats',
      name: 'Search Chats',
      description: 'Open the search interface to browse through historic files.',
      keys: ['Alt', 'S']
    },
    {
      id: 'toggle_theme',
      name: 'Toggle Visual Theme',
      description: 'Instantly swap between light mode and dark obsidian mode.',
      keys: ['Alt', 'T']
    },
    {
      id: 'toggle_sidebar',
      name: 'Toggle Sidebar Workspace',
      description: 'Minimize or expand the primary left navigation panel.',
      keys: ['Alt', 'M']
    }
  ];

  return createPortal(
    <div 
      id="shortcuts-modal-overlay" 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#151515] text-slate-800 dark:text-zinc-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans border border-slate-200 dark:border-[#333]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-[#222]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
              <Keyboard size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Keyboard Shortcuts Panel
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Configure hotkeys for rapid terminal operations
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#222]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/20 px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2.5">
            <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Use these global hotkey bindings anywhere inside the application to operate the interface without leaving your keyboard.
            </p>
          </div>

          <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-zinc-850">
            {shortcutsList.map((sc, index) => {
              const active = enabledShortcuts[sc.id];
              return (
                <div 
                  key={sc.id} 
                  className={`flex items-center justify-between pt-3.5 ${index === 0 ? 'pt-0 border-none' : ''}`}
                >
                  <div className="flex-1 pr-4">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
                      {sc.name}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                      {sc.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Keys combination visualizer */}
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      {sc.keys.map((key, kIndex) => (
                        <React.Fragment key={kIndex}>
                          {kIndex > 0 && <span className="opacity-40">+</span>}
                          <kbd className="px-2 py-1 bg-slate-100 dark:bg-[#202020] border border-slate-200 dark:border-zinc-800 rounded-md shadow-sm">
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Premium slide toggle button */}
                    <button
                      onClick={() => toggleShortcut(sc.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        active ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#1a1a1a]/40 px-6 py-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-[#222]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 border border-transparent hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Close & Save
          </button>
        </div>

      </motion.div>
    </div>,
    document.body
  );
}
