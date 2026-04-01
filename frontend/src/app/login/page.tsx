"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import { Smartphone, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 selection:bg-[var(--accent)] selection:text-[var(--bg)]">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[420px] z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--sidebar)] border border-[var(--border)] rounded-2xl mb-6 shadow-2xl relative">
             <div className="absolute inset-0 bg-[var(--accent)] opacity-10 blur-xl rounded-full animate-pulse" />
             <Smartphone size={32} className="text-[var(--accent)] relative z-10" />
          </div>
          <div className="flex items-baseline justify-center gap-[2px] text-5xl font-black tracking-tighter leading-none mb-3">
            <span className="text-[#e31e24]">k</span>
            <span className="text-[#f15a24]">b</span>
            <span className="text-[#fbb03b]">m</span>
            <span className="text-[#00aeef]">i</span>
          </div>
          <p className="text-[var(--text3)] text-sm font-bold uppercase tracking-[4px]">Reparaciones</p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
          
          <div className="space-y-6">
            <div className="text-center space-y-1">
               <h2 className="text-lg font-bold text-[var(--text)]">Bienvenido</h2>
               <p className="text-xs text-[var(--text3)]">Selecciona tu método de acceso para continuar</p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Admin / Google Button */}
              <button 
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-lg active:scale-[0.98] group"
              >
                <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Acceso Administrador
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="h-[1px] flex-1 bg-[var(--border2)]" />
                <span className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest">o</span>
                <div className="h-[1px] flex-1 bg-[var(--border2)]" />
              </div>

              {/* Guest / Demo Button */}
              <button 
                onClick={() => signIn('credentials', { callbackUrl: '/dashboard' })}
                className="w-full bg-[var(--bg2)] hover:bg-[var(--card)] text-[var(--text2)] border border-[var(--border)] py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all active:scale-[0.98] group"
              >
                <User size={20} className="text-[var(--text3)] group-hover:text-[var(--accent)] transition-colors" />
                Probar Demo (Invitado)
                <ArrowRight size={16} className="text-[var(--text3)] ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <div className="pt-6 border-t border-[var(--border2)]">
               <div className="flex items-center justify-center gap-2 text-[var(--text3)] opacity-50 group pointer-events-none">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] group-hover:text-[var(--accent)] transition-colors">Seguridad de Nivel Empresarial</span>
               </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-[10px] font-mono text-[var(--text3)] uppercase tracking-[0.2em]">
          Kbmi Taller v2.0 &copy; 2026
        </p>
      </div>
    </div>
  );
}
