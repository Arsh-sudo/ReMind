import React, { useState, useEffect } from 'react';
import { Sun, Moon, Loader2, Search, Code2, Shield, Activity, Sparkles, Orbit, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithGoogle } from '../firebase';
import { AppLogo } from './AppLogo';
import { ParticleBackground } from './ParticleBackground';

interface DiagnosticLog {
  id: number;
  time: string;
  agent: string;
  msg: string;
}

export function LoginScreen({ onLogin, theme, toggleTheme }: { 
  onLogin: (name: string, photoUrl: string | null, uid: string) => void, 
  theme: 'light'|'dark', 
  toggleTheme: () => void 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    { id: 1, time: "08:00:01", agent: "SYSTEM", msg: "Primary subroutines booting..." },
    { id: 2, time: "08:00:03", agent: "ARGO (WEB)", msg: "Live indexer primed, standing by on port 3000..." },
    { id: 3, time: "08:00:04", agent: "DEXTER (CODE)", msg: "Sandboxed compiler sandbox compiled." }
  ]);

  // Seed live-ticking terminal log simulation to make it feel super alive!
  useEffect(() => {
    const messages = [
      { agent: "SYSTEM", msg: "Refreshing security handshakes..." },
      { agent: "AEGIS (CRITIC)", msg: "Integrity guard scanning active databases..." },
      { agent: "ARGO (WEB)", msg: "Parsing current global queries backlog..." },
      { agent: "DEXTER (CODE)", msg: "Optimizing memory cache blocks..." },
      { agent: "SYSTEM", msg: "Telemetry status: ALL SYSTEMS STANDBY" },
      { agent: "AEGIS (CRITIC)", msg: "Verifiers initialized. Ready for credentials hook." }
    ];

    const timer = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => {
        const next = [...prev, { id: Date.now(), time: timeStr, agent: randomMsg.agent, msg: randomMsg.msg }];
        if (next.length > 5) next.shift(); // Keep last 5
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      onLogin(user.displayName || 'Google User', user.photoURL, user.uid);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className={`${theme} min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505] p-4 md:p-8 transition-colors duration-300 relative overflow-hidden`}>
      {/* 1. Interactive canvas background (Particles + Trail) */}
      <ParticleBackground />

      <button 
         onClick={toggleTheme}
         className="absolute top-6 right-6 w-11 h-11 rounded-full border border-slate-200 dark:border-[#333] flex items-center justify-center bg-white/80 dark:bg-[#111]/80 backdrop-blur-sm hover:scale-105 transition-transform text-slate-600 dark:text-zinc-400 shadow-sm z-30"
      >
         {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Main Glass Backplate Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">
        
        {/* LEFT COLUMN: THE THREE AGENTS WAITING VISUALIZATION (Desktop and tablet adaptive) */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mb-4 border border-indigo-500/20 shadow-sm">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              Intelligence Core Standby
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight lg:leading-none">
              Meet your <span className="text-indigo-600 dark:text-indigo-400 bg-clip-text">ReMind</span> Agents.
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base mt-3 max-w-lg leading-relaxed font-serif italic">
              "Three specialist agents calibrated to extract, analyze, and verify knowledge — waiting to begin your synthesis stream."
            </p>
          </motion.div>

          {/* Core visual representations of the 3 agents waiting */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6">
            
            {/* Agent 1: Web Agent Standby Card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            >
              {/* Spinning outer scanner */}
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-blue-500/40 rounded-full"
                />
                <div className="w-10 h-10 md:w-11 md:h-11 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
                  <Search size={18} className="animate-pulse" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-3 uppercase tracking-wider">Argo</h4>
              <p className="text-[10px] text-blue-500 font-mono mt-1 font-semibold dark:text-blue-400">WEB SEARCH</p>
              <div className="w-full h-[1px] bg-slate-100 dark:bg-zinc-800 my-2" />
              <div className="text-[9px] text-slate-400 dark:text-zinc-500 leading-tight font-mono h-8 flex items-center justify-center">
                AWAITING HANDSHAKE
              </div>
            </motion.div>

            {/* Agent 2: Code Agent Standby Card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.3 }}
              className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            >
              {/* Floating microchip */}
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute inset-0 border border-dotted border-amber-500/40 rounded-xl"
                />
                <div className="w-10 h-10 md:w-11 md:h-11 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shadow-inner">
                  <Cpu size={18} className="animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-3 uppercase tracking-wider">Dexter</h4>
              <p className="text-[10px] text-amber-500 font-mono mt-1 font-semibold dark:text-amber-400">DATA ANALYST</p>
              <div className="w-full h-[1px] bg-slate-100 dark:bg-zinc-800 my-2" />
              <div className="text-[9px] text-slate-400 dark:text-zinc-500 leading-tight font-mono h-8 flex items-center justify-center">
                SANDBOX PRIMED
              </div>
            </motion.div>

            {/* Agent 3: Critic Agent Standby Card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.6 }}
              className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            >
              {/* Protective Shield Ring */}
              <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 border border-emerald-500/20 rounded-full"
                />
                <div className="w-10 h-10 md:w-11 md:h-11 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                  <Shield size={18} className="animate-pulse" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-3 uppercase tracking-wider">Aegis</h4>
              <p className="text-[10px] text-emerald-500 font-mono mt-1 font-semibold dark:text-emerald-400">CRITIC NET</p>
              <div className="w-full h-[1px] bg-slate-100 dark:bg-zinc-800 my-2" />
              <div className="text-[9px] text-slate-400 dark:text-zinc-500 leading-tight font-mono h-8 flex items-center justify-center">
                SAFETY SHIELDS LIVE
              </div>
            </motion.div>

          </div>

          {/* Live system monitoring terminal panel (Desktop only) */}
          <div className="hidden md:block bg-slate-900 dark:bg-[#060606]/85 border border-slate-800 dark:border-zinc-850/60 p-4 rounded-xl shadow-lg w-full max-w-2xl font-mono">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold tracking-widest uppercase ml-2">SYSTEM CONSOLE // DIAGNOSTICS</span>
            </div>
            <div className="space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="text-xs flex items-start gap-2.5 text-left">
                  <span className="text-slate-600 font-medium shrink-0">[{log.time}]</span>
                  <span className="text-indigo-400 font-bold uppercase tracking-tighter shrink-0">{log.agent}:</span>
                  <span className="text-slate-300 dark:text-zinc-300 font-light truncate">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE LOGIN SIGN-IN SHEET (lg:col-span-4) */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-lg rounded-3xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-zinc-800/80 p-8 md:p-10 relative overflow-hidden"
          >
            {/* Soft accent glow on login form */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="relative mb-4">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-md opacity-45 animate-pulse" />
                <AppLogo className="w-16 h-16 relative bg-white dark:bg-[#0a0a0a] rounded-3xl p-1 shadow-md border border-slate-200 dark:border-zinc-800" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-widest uppercase mb-1 font-sans">
                ReMind
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-500 text-center uppercase tracking-widest font-mono">
                Federated Intelligence Platform
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs leading-relaxed"
              >
                {error.includes('unauthorized-domain') ? (
                  <div className="space-y-1.5 text-left text-red-700 dark:text-red-300">
                    <p className="font-semibold text-sm">Firebase: Unauthorized Domain Error</p>
                    <p className="text-[11px] opacity-90">
                      The deployed shared domain (<strong>{window.location.hostname}</strong>) has not yet been registered in your Firebase project's Authorized Domains.
                    </p>
                    <div className="text-[10px] p-2.5 bg-red-100/50 dark:bg-red-950/40 rounded-lg text-slate-700 dark:text-zinc-300 font-mono mt-2 space-y-1">
                      <p className="font-semibold uppercase tracking-wider text-[9px] mb-1">To Resolve This:</p>
                      <p className="font-medium text-indigo-600 dark:text-indigo-400">Option A: Re-deploy in AI Studio</p>
                      <p className="opacity-80">Relaunch, click any "Deploy" or "Sync" buttons in the AI Studio platform to prompt automatic whitelisting update for the shared link.</p>
                      <p className="font-medium text-amber-500 mt-1.5">Option B: Use your private Firebase Project</p>
                      <p className="opacity-80">1. Go to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains.</p>
                      <p className="opacity-80">2. Register <strong>{window.location.hostname}</strong> as an authorized origin.</p>
                    </div>
                  </div>
                ) : (
                  error
                )}
              </motion.div>
            )}

            <button 
               type="button"
               onClick={handleGoogleLogin}
               disabled={isLoading}
               className="w-full bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-2xl px-5 py-4 text-sm font-bold transition-all flex items-center justify-center gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-none hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500 animate-spin" /> : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" />
                  </svg>
                  <span className="tracking-wide">Sign in with Google</span>
                </>
              )}
            </button>

            {/* Bottom info foot-note */}
            <p className="text-[10px] text-slate-400 dark:text-zinc-600 text-center mt-6 uppercase tracking-wider font-semibold font-mono">
              Secure Sandbox Environments Active
            </p>

          </motion.div>
        </div>

      </div>
    </div>
  );
}
