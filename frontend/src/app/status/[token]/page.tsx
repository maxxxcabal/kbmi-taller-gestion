"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Clock, CheckCircle2, AlertCircle, Smartphone, User, Wrench, Package, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STEPS = [
  { id: 'ingresado', label: 'Ingresado', icon: Package },
  { id: 'diagnostico', label: 'Diagnóstico', icon: AlertCircle },
  { id: 'en_reparacion', label: 'En Reparación', icon: Wrench },
  { id: 'listo', label: 'Listo para Retirar', icon: CheckCircle2 },
  { id: 'entregado', label: 'Entregado', icon: ShieldCheck },
];

export default function StatusPage() {
  const params = useParams();
  const token = params.token;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      fetchStatus();
      // Auto-refresh every 60s
      const interval = setInterval(fetchStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchStatus = async () => {
    try {
      const data = await apiFetch(`/ordenes/public/${token}`);
      setOrder(data);
      setError(false);
    } catch (err) {
      console.error("Error fetching status:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-[var(--text3)] font-mono uppercase tracking-[0.2em] text-[10px]">Cargando Estado...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-5 rounded-full mb-6 border border-red-500/20">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-[var(--text)] mb-2">Orden no encontrada</h1>
        <p className="text-[var(--text3)] text-sm max-w-xs mx-auto mb-8">
          El link de seguimiento parece haber expirado o es incorrecto. Por favor, consulta directamente con el taller.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[var(--accent)] text-[var(--bg)] px-8 py-3 rounded-xl text-xs font-bold hover:shadow-[0_0_20px_rgba(0,184,141,0.4)] transition-all"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === order.estado);
  const isFinalStep = order.estado === 'entregado' || order.estado === 'listo';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[var(--text)] selection:bg-[var(--accent)] selection:text-[var(--bg)] font-sans pb-20">
      
      {/* Premium Header/Banner */}
      <div className="relative h-64 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-dim)]/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80')] bg-cover bg-center brightness-50 grayscale opacity-20" />
        
        <div className="relative z-20 max-w-lg mx-auto h-full flex flex-col justify-end p-6 pb-8">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-[var(--bg)] shadow-[0_0_15px_rgba(0,184,141,0.3)]">
                 <Smartphone size={24} />
              </div>
              <div className="font-mono text-[var(--accent)] font-bold tracking-tighter text-lg">FixLab Tracking</div>
           </div>
           <h1 className="text-3xl font-extrabold tracking-tight leading-tight">Estado de tu Reparación</h1>
           <div className="mt-2 text-[var(--text3)] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Actualizado en vivo
           </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6 space-y-8 -mt-6 relative z-30">
        
        {/* Order Identifier Card */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl backdrop-blur-md">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest mb-1">Orden</div>
                 <div className="text-2xl font-black text-[var(--accent)]">{order.codigo}</div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest mb-1">Fecha Ingreso</div>
                 <div className="text-sm font-bold">{format(new Date(order.created_at), "dd MMM, yyyy", { locale: es })}</div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[var(--card)]/50 p-4 rounded-xl border border-[var(--border)]">
                 <div className="w-10 h-10 bg-[var(--bg)] rounded-lg flex items-center justify-center text-[var(--text2)]">
                    <Smartphone size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest">Dispositivo</div>
                    <div className="text-sm font-bold">{order.equipo.marca} {order.equipo.modelo}</div>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[var(--card)]/50 p-4 rounded-xl border border-[var(--border)]">
                 <div className="w-10 h-10 bg-[var(--bg)] rounded-lg flex items-center justify-center text-[var(--text2)]">
                    <AlertCircle size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest">Reportado</div>
                    <div className="text-sm font-bold line-clamp-2">{order.problema}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Stepper / Timeline */}
        <div className="space-y-6">
           <h2 className="text-xs font-mono text-[var(--text3)] uppercase tracking-[0.3em] px-2">Línea de Tiempo</h2>
           
           <div className="relative pl-8 space-y-12">
              {/* Vertical Progress Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[var(--border)]" />
              <div 
                className="absolute left-[11px] top-2 w-[2px] bg-[var(--accent)] transition-all duration-1000 ease-in-out" 
                style={{ height: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div key={idx} className={`relative flex items-start gap-6 transition-all duration-500 ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`absolute -left-[30px] w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center transition-all duration-500 ${
                       isCompleted ? 'bg-[var(--accent)] border-[var(--accent)] scale-110 shadow-[0_0_15px_rgba(0,184,141,0.5)]' : 'bg-[#0a0a0b] border-[var(--border)]'
                    }`}>
                       {isCompleted ? <CheckCircle2 size={12} className="text-[var(--bg)]" /> : <div className="w-1 h-1 bg-[var(--text3)] rounded-full" />}
                    </div>

                    <div className="flex-1 -mt-1">
                       <div className="flex items-center gap-3 mb-1">
                          <StepIcon size={16} className={isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text3)]'} />
                          <h3 className={`text-sm font-extrabold ${isCompleted ? 'text-[var(--text)]' : 'text-[var(--text3)]'}`}>{step.label}</h3>
                       </div>
                       {isCurrent && (
                          <div className="text-xs text-[var(--accent)] font-mono animate-pulse">Este es el estado actual de tu equipo</div>
                       )}
                       {idx === 0 && (
                          <div className="text-[10px] text-[var(--text3)] mt-1 tracking-tight">Recibido y registrado en sistema.</div>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Final Information / Action */}
        {order.estado === 'listo' && (
           <div className="bg-[var(--accent-dim)] border border-[var(--accent)] rounded-2xl p-6 text-center animate-bounce-slow">
              <div className="text-3xl mb-4">🎉</div>
              <h2 className="text-lg font-black text-[var(--accent)] mb-2">¡Tu equipo está listo!</h2>
              <p className="text-xs text-[var(--text)] opacity-80 leading-relaxed max-w-[240px] mx-auto">
                 Ya puedes pasar por el taller a retirarlo. No olvides traer tu comprobante.
              </p>
              {order.precio > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--accent)]/20">
                   <div className="text-[10px] font-mono uppercase text-[var(--accent)] opacity-60">Total a Pagar</div>
                   <div className="text-2xl font-black text-[var(--text)]">${order.precio.toLocaleString()}</div>
                </div>
              )}
           </div>
        )}

        <div className="pt-10 text-center">
            <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-widest mb-4">FixLab Secure Tracking</div>
            <div className="flex items-center justify-center gap-1.5 grayscale opacity-30">
               <ShieldCheck size={14} />
               <span className="text-[9px] font-medium tracking-tighter">SISTEMA PROTEGIDO CON IA</span>
            </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>

    </div>
  );
}
