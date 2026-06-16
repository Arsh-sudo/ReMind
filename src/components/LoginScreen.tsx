import React, { useState } from 'react';
import { Sun, Moon, Loader2, Search, BrainCircuit, LineChart } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import logoUrl from '../assets/images/app_logo_1781546652971.jpg';

export function LoginScreen({ onLogin, theme, toggleTheme }: { onLogin: (name: string, photoUrl: string | null, uid: string) => void, theme: 'light'|'dark', toggleTheme: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className={`${theme} min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505] p-4 transition-colors duration-300 relative`}>
      <button 
         onClick={toggleTheme}
         className="absolute top-6 right-6 w-10 h-10 rounded-full border border-slate-200 dark:border-[#333] flex items-center justify-center bg-white dark:bg-[#111] hover:scale-105 transition-transform text-slate-600 dark:text-zinc-400 shadow-sm"
      >
         {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-[#222] p-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logoUrl} 
            alt="ReMind Logo" 
            className="w-16 h-16 rounded-2xl object-cover mb-4 shadow-md"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-1">ReMind</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-500 text-center">Sign in to access your intelligence dashboard</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs leading-relaxed">
            {error}
          </div>
        )}

        <button 
           type="button"
           onClick={handleGoogleLogin}
           disabled={isLoading}
           className="w-full bg-white dark:bg-[#111] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] border border-slate-200 dark:border-[#333] text-slate-700 dark:text-zinc-300 rounded-lg px-4 py-4 text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

      </div>
    </div>
  );
}
