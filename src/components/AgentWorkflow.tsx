import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Search, LineChart, ShieldCheck, Loader2 } from 'lucide-react';

interface AgentStatus {
  agent: string;
  message: string;
}

const getAgentDetails = (agentName: string) => {
  switch (agentName.toLowerCase()) {
    case 'orchestrator':
      return { icon: BrainCircuit, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' };
    case 'web search':
    case 'web':
      return { icon: Search, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
    case 'code executor':
    case 'code':
    case 'data':
      return { icon: LineChart, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
    case 'critic':
      return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
    default:
      return { icon: BrainCircuit, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
  }
};

export function AgentWorkflow({ agents }: { agents: AgentStatus[] }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 pt-12 pb-24">
      {agents.map((agentData, idx) => {
        const details = getAgentDetails(agentData.agent);
        const Icon = details.icon;
        
        return (
          <motion.div
            key={agentData.agent}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl border bg-white dark:bg-[#0a0a0a] max-w-xl w-full border-slate-200 dark:border-[#222] shadow-lg dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-colors duration-300`}
          >
            <div className={`shrink-0 w-10 h-10 rounded flex items-center justify-center bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-zinc-800 ${details.color}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-baseline mb-1">
                 <h3 className={`font-sans text-[11px] uppercase tracking-widest font-bold ${details.color}`}>
                   {agentData.agent} Agent
                 </h3>
                 <Loader2 className={`w-3.5 h-3.5 animate-spin ${details.color} opacity-70`} />
               </div>
               <p className="text-slate-600 dark:text-zinc-400 text-sm leading-snug">
                 {agentData.message}
               </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
