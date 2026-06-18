import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, ShieldCheck, Loader2, Sparkles, 
  Cpu, Code2, Orbit, Activity, Shield, Layers
} from 'lucide-react';

interface AgentStatus {
  agent: string;
  message: string;
}

interface AgentWorkflowProps {
  agents: AgentStatus[];
  selectedAgents?: string[];
  activeQuery?: string;
}

// Locate current status of an agent from real-time event stream
const getAgentStatusText = (agentKey: 'web' | 'code' | 'critic', agents: AgentStatus[]) => {
  const match = agents.find(a => {
    const name = a.agent.toLowerCase();
    if (agentKey === 'web') return name.includes('web') || name.includes('search');
    if (agentKey === 'code') return name.includes('code') || name.includes('executor') || name.includes('data') || name.includes('analyst');
    if (agentKey === 'critic') return name.includes('critic') || name.includes('verify');
    return false;
  });
  
  if (match) return match.message;
  
  // Custom high-fidelity loading states to look premium
  if (agentKey === 'web') return "Initializing real-time internet indexing engine...";
  if (agentKey === 'code') return "Provisioning sandboxed compiler environment...";
  return "Aligning evaluation criteria and verification shields...";
};

// ==================== AGENT 1: WEB SEARCH AGENT (Argo the Explorer) ====================
function WebAgentFigure({ size = "medium" }: { size?: "medium" | "large" }) {
  const isLarge = size === "large";
  const dim = isLarge ? "w-44 h-44" : "w-28 h-28";
  
  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      {/* Outer rotating coordinate grids */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="absolute inset-0 border border-dashed border-blue-500/30 rounded-full"
      />
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute inset-2 border border-dotted border-indigo-400/25 rounded-full"
      />

      {/* Pulsing search target target zones */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute inset-6 bg-blue-500/5 dark:bg-blue-500/10 rounded-full"
      />

      {/* Main drone body */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative w-16 h-16 bg-white dark:bg-[#0a0a0a] border-2 border-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center z-10"
      >
        {/* Visor lens */}
        <div className="w-10 h-10 bg-slate-950 rounded-full border border-blue-400/40 flex items-center justify-center overflow-hidden relative">
          <motion.div 
            animate={{ 
              x: [-12, 12, -12],
              scaleX: [1, 1.4, 1]
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="w-4 h-1.5 bg-blue-400 rounded-full blur-[1px] shadow-[0_0_8px_#60a5fa]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
        </div>

        {/* Dynamic laser radar beam */}
        <svg className="absolute -inset-12 w-40 h-40 pointer-events-none transform origin-center" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="webScanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.polygon
            points="50,50 30,100 70,100"
            fill="url(#webScanGrad)"
            animate={{ 
              rotate: [0, 360],
              transformOrigin: "50px 50px"
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          />
        </svg>

        {/* Floating companion widget satellites */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute -inset-2 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
        </motion.div>
      </motion.div>
      
      {/* Icon watermark indicator */}
      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-lg shadow-md z-20">
        <Search size={12} className="animate-pulse" />
      </div>
    </div>
  );
}

// ==================== AGENT 2: DATA ANALYST / CODE AGENT (Dexter the Compiler) ====================
function CodeAgentFigure({ size = "medium" }: { size?: "medium" | "large" }) {
  const isLarge = size === "large";
  const dim = isLarge ? "w-44 h-44" : "w-28 h-28";

  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      {/* Matrix digital ring orbit */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute inset-0 border border-amber-500/20 rounded-lg transform rotate-45"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        className="absolute inset-3 border border-dashed border-amber-500/30 rounded-full"
      />

      {/* Floating equalizing data streams */}
      <div className="absolute bottom-1 w-full flex justify-between px-4 opacity-40 z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [10, 40, 10] }}
            transition={{ repeat: Infinity, duration: 1.5 + i * 0.2, ease: "easeInOut" }}
            className="w-1 bg-amber-500/50 rounded-full"
          />
        ))}
      </div>

      {/* Core Compiler Cube */}
      <motion.div
        animate={{ 
          y: [4, -4, 4],
          rotate: [0, 4, 0]
        }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="relative w-16 h-16 bg-white dark:bg-[#0a0a0a] border-2 border-amber-500 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center z-10 p-1 overflow-hidden"
      >
        {/* Floating math symbols and code tags */}
        <div className="absolute inset-1 grid grid-cols-2 opacity-15">
          <span className="text-[9px] font-mono select-none text-amber-500">{"{}"}</span>
          <span className="text-[9px] font-mono select-none text-amber-500">{"=>"}</span>
          <span className="text-[9px] font-mono select-none text-amber-500">{"f(x)"}</span>
          <span className="text-[9px] font-mono select-none text-amber-500">{"</>"}</span>
        </div>

        {/* Core microprocessor grid */}
        <div className="w-8 h-8 rounded-md bg-slate-900 border border-amber-500/30 flex flex-wrap gap-0.5 p-1 relative overflow-hidden">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-amber-400 rounded-sm"
            />
          ))}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-amber-500/20" />
        </div>
      </motion.div>

      {/* Companion orbital sparks */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
      </motion.div>

      {/* Icon watermark indicator */}
      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-lg shadow-md z-20">
        <Code2 size={12} className="animate-bounce" />
      </div>
    </div>
  );
}

// ==================== AGENT 3: CRITIC AGENT (Aegis the Evaluator) ====================
function CriticAgentFigure({ size = "medium" }: { size?: "medium" | "large" }) {
  const isLarge = size === "large";
  const dim = isLarge ? "w-44 h-44" : "w-28 h-28";

  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      {/* Outer protective safety ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        className="absolute inset-0 border border-emerald-500/20 rounded-full"
      />

      {/* Golden ratio coordinate ticks */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.circle
          r="44"
          cx="50%"
          cy="50%"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="4 6"
          animate={{ rotate: -360 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        />
      </svg>

      {/* Pulsing protective bubble */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute inset-5 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
      />

      {/* Main Diamond Shield Body */}
      <motion.div
        animate={{ 
          y: [-3, 3, -3],
          scale: [0.97, 1.03, 0.97]
        }}
        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
        className="relative w-16 h-16 bg-white dark:bg-[#0a0a0a] border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center z-10 rotate-45 rounded-lg overflow-hidden"
      >
        {/* Core Evaluator Prism */}
        <div className="w-8 h-8 rounded-sm bg-slate-950 flex items-center justify-center -rotate-45 relative">
          <motion.div 
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-4 h-4 bg-emerald-500 rounded-full blur-[2px] shadow-[0_0_10px_#10b981]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/15 to-transparent" />
        </div>
      </motion.div>

      {/* Verification scanning radar bar */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        className="absolute inset-4 pointer-events-none border-t border-emerald-500/50 rounded-full"
      />

      {/* Icon watermark indicator */}
      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg shadow-md z-20">
        <ShieldCheck size={12} className="animate-ping" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
}

// ==================== CONNECTOR PATH COMPONENT ====================
function ConnectionCable({ from, to, delay = 0, color = "blue" }: { from: string, to: string, delay?: number, color?: "blue" | "amber" | "emerald" | "mixed" }) {
  const gradientId = `cableGrad-${from}-${to}`;
  
  let strokeColor = "#3b82f6";
  let animateColor = ["#3b82f6", "#6366f1", "#3b82f6"];
  if (color === "amber") {
    strokeColor = "#f59e0b";
    animateColor = ["#f59e0b", "#d97706", "#f59e0b"];
  } else if (color === "emerald") {
    strokeColor = "#10b981";
    animateColor = ["#10b981", "#059669", "#10b981"];
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 800 400" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${from} Q 400 200 ${to}`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.path
        d={`M ${from} Q 400 200 ${to}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="14 18"
        animate={{ 
          strokeDashoffset: [-120, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "linear",
          delay 
        }}
      />
    </svg>
  );
}

// ==================== MAIN WORKFLOW SCENE CONTROLLER ====================
export function AgentWorkflow({ agents, selectedAgents, activeQuery }: AgentWorkflowProps) {
  // Gracefully resolve which agents are checked
  const activeSelected = selectedAgents && selectedAgents.length > 0 
    ? selectedAgents 
    : ['web', 'code', 'critic'];

  const count = activeSelected.length;
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  // Retrieve current active server status messages
  const webMsg = getAgentStatusText('web', agents);
  const codeMsg = getAgentStatusText('code', agents);
  const criticMsg = getAgentStatusText('critic', agents);

  // Layout selection based on active agents count
  return (
    <div className="w-full max-w-4xl mx-auto py-12 md:py-16 px-4 flex flex-col items-center justify-center transition-all duration-500">
      
      {/* 1. Styled Query Capsule (Source Core of typed text) */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 md:p-6 mb-12 shadow-[0_4px_30px_rgb(0,0,0,0.02)] dark:shadow-none flex flex-col md:flex-row items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
          <Activity size={22} className="animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h4 className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold mb-1">
            Analyzing Target Intent
          </h4>
          <p className="text-slate-800 dark:text-zinc-200 font-serif text-base font-light italic truncate pr-3">
             "{activeQuery || "Active Research Synthesis Request"}"
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
             Cooperative protocol
          </span>
        </div>
      </motion.div>

      {/* ==================== WORKSPACE VISUAL SCENES ==================== */}
      
      {/* SCENARIO A: THREE AGENTS WORKING TOGETHER */}
      {count === 3 && (
        <div className="w-full flex flex-col items-center relative py-12">
          {/* Centralized Grid Backplane */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
            <div className="w-[450px] h-[300px] border border-dashed border-indigo-400 rounded-full" />
            <div className="absolute w-[250px] h-[150px] border border-dotted border-purple-400 rounded-full" />
          </div>

          {/* SVG Communications Mesh */}
          <ConnectionCable from="120 100" to="400 320" delay={0} color="blue" />
          <ConnectionCable from="680 100" to="400 320" delay={0.8} color="amber" />
          <ConnectionCable from="120 100" to="680 100" delay={1.5} color="emerald" />

          {/* Agent grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full relative z-10 mb-8">
            
            {/* Figure 1: Web Agent */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
            >
              <WebAgentFigure size="medium" />
              <h3 className="text-sm font-sans font-bold text-blue-500 uppercase tracking-widest mt-4 mb-2">
                Web Search Agent
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                {webMsg}
              </p>
            </motion.div>

            {/* Figure 2: Data/Code Agent */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
            >
              <CodeAgentFigure size="medium" />
              <h3 className="text-sm font-sans font-bold text-amber-500 uppercase tracking-widest mt-4 mb-2">
                Data Analyst Agent
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                {codeMsg}
              </p>
            </motion.div>

            {/* Figure 3: Critic Agent */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
            >
              <CriticAgentFigure size="medium" />
              <h3 className="text-sm font-sans font-bold text-emerald-500 uppercase tracking-widest mt-4 mb-2">
                Critic Agent
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                {criticMsg}
              </p>
            </motion.div>

          </div>
        </div>
      )}

      {/* SCENARIO B: TWO SELECTED AGENTS (Cooperation state between selected pair) */}
      {count === 2 && (
        <div className="w-full flex flex-col items-center relative py-12">
          {/* Custom Grid lines */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
            <div className="w-[500px] h-[150px] border border-dashed border-indigo-400/80 rounded-full" />
          </div>

          {/* SVG Communications link hook */}
          <ConnectionCable from="180 150" to="620 150" delay={0} color="mixed" />

          {/* Dual layout container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-3xl relative z-10 mb-8">
            
            {/* Left Agent (Either Web or Code depending on combination) */}
            {activeSelected.includes('web') ? (
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
              >
                <WebAgentFigure size="medium" />
                <h3 className="text-sm font-sans font-bold text-blue-500 uppercase tracking-widest mt-4 mb-2">
                  Web Search Agent
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                  {webMsg}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
              >
                <CodeAgentFigure size="medium" />
                <h3 className="text-sm font-sans font-bold text-amber-500 uppercase tracking-widest mt-4 mb-2">
                  Data Analyst Agent
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                  {codeMsg}
                </p>
              </motion.div>
            )}

            {/* Right Agent (The other selected partner) */}
            {activeSelected.includes('critic') ? (
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
              >
                <CriticAgentFigure size="medium" />
                <h3 className="text-sm font-sans font-bold text-emerald-500 uppercase tracking-widest mt-4 mb-2">
                  Critic Agent
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                  {criticMsg}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none"
              >
                <CodeAgentFigure size="medium" />
                <h3 className="text-sm font-sans font-bold text-amber-500 uppercase tracking-widest mt-4 mb-2">
                  Data Analyst Agent
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 text-center leading-relaxed font-normal min-h-[40px]">
                  {codeMsg}
                </p>
              </motion.div>
            )}

          </div>

          {/* Collaborative Interaction Label */}
          <div className="bg-slate-50 dark:bg-[#111] px-4 py-2 border border-slate-100 dark:border-zinc-800 rounded-full text-[11px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-bold font-mono">
            {activeSelected.includes('web') && activeSelected.includes('code') && "Pipetask: Data Parsing Connection Stream"}
            {activeSelected.includes('web') && activeSelected.includes('critic') && "Pipetask: Direct Fact Check Scanning"}
            {activeSelected.includes('code') && activeSelected.includes('critic') && "Pipetask: Logic Verification Verification Net"}
          </div>
        </div>
      )}

      {/* SCENARIO C: ONE SINGLE AGENT (Intense solo focus) */}
      {count === 1 && (
        <div className="w-full flex flex-col items-center relative py-8">
          
          {/* Centered Massive Figure */}
          <div className="relative flex justify-center items-center p-8 bg-white dark:bg-[#060606] border border-slate-100 dark:border-zinc-900/50 rounded-3xl max-w-md w-full shadow-lg dark:shadow-none z-10 select-none">
            
            {/* Solo decorative backplane orbit */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-[0.03] dark:opacity-[0.06]">
              <div className="w-96 h-96 border border-indigo-400 rounded-full absolute -top-16 -left-16 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="w-72 h-72 border border-dashed border-indigo-400 rounded-full absolute -bottom-16 -right-16 animate-spin" style={{ animationDuration: '60s' }} />
            </div>

            {activeSelected.includes('web') && (
              <div className="flex flex-col items-center">
                <WebAgentFigure size="large" />
                <h3 className="text-base font-sans font-bold text-blue-500 uppercase tracking-widest mt-6 mb-2">
                  Web Search Agent (Solo Mode)
                </h3>
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 text-center leading-relaxed max-w-sm mt-2 px-4">
                  {webMsg}
                </p>
              </div>
            )}

            {activeSelected.includes('code') && (
              <div className="flex flex-col items-center">
                <CodeAgentFigure size="large" />
                <h3 className="text-base font-sans font-bold text-amber-500 uppercase tracking-widest mt-6 mb-2">
                  Data Analyst Agent (Solo Mode)
                </h3>
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 text-center leading-relaxed max-w-sm mt-2 px-4">
                  {codeMsg}
                </p>
              </div>
            )}

            {activeSelected.includes('critic') && (
              <div className="flex flex-col items-center">
                <CriticAgentFigure size="large" />
                <h3 className="text-base font-sans font-bold text-emerald-500 uppercase tracking-widest mt-6 mb-2">
                  Critic Agent (Solo Mode)
                </h3>
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 text-center leading-relaxed max-w-sm mt-2 px-4">
                  {criticMsg}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Helper text block to frame negative space beautifully */}
      <div className="mt-8 text-center">
         <p className="text-[11px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
           Consensus Synthesizer Active • Processing multi-agent telemetry
         </p>
      </div>

    </div>
  );
}
