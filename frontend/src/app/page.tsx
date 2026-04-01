"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Loader2, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Orden {
  id: string;
  codigo: string;
  cliente: { nombre: string };
  equipo: { modelo: string };
  problema: string;
  estado: string;
  precio: number;
  created_at: string;
}

import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      try {
        const url = query ? `/ordenes/?q=${encodeURIComponent(query)}` : "/ordenes/";
        const data = await apiFetch(url);
        setOrdenes(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [query]);

  const stats = {
    activas: ordenes.filter(o => ["ingresado", "diagnostico", "reparacion", "esperando_repuesto"].includes(o.estado)).length,
    listas: ordenes.filter(o => o.estado === "listo").length,
    demoradas: ordenes.filter(o => {
      const days = (new Date().getTime() - new Date(o.created_at).getTime()) / (1000 * 3600 * 24);
      return days > 3 && !["entregado", "listo", "devuelto"].includes(o.estado);
    }).length,
    ingresos: ordenes.reduce((acc, o) => acc + (o.precio || 0), 0)
  };

  const urgentes = ordenes
    .filter(o => o.estado !== "listo" && o.estado !== "entregado")
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 opacity-50">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        <div className="text-sm font-mono uppercase tracking-[2px]">Cargando Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col gap-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatCard 
          label="Órdenes activas" 
          value={stats.activas} 
          sub="En proceso" 
          color="accent" 
        />
        <StatCard 
          label="Listas para retirar" 
          value={stats.listas} 
          sub="Notificar clientes" 
          color="blue" 
        />
        <StatCard 
          label="Rep. Demoradas" 
          value={stats.demoradas} 
          sub={stats.demoradas > 0 ? "Atención requerida" : "Todo al día"} 
          color={stats.demoradas > 0 ? "red" : "yellow"} 
        />
        <StatCard 
          label="Ingresos proyectados" 
          value={`$${(stats.ingresos || 0).toLocaleString()}`} 
          sub="Total en caja" 
          color="accent" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Urgency List */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4.5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-sm font-extrabold text-[var(--text)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" /> 
              Reparaciones prioritarias
            </div>
          </div>
          
          {urgentes.length === 0 ? (
            <div className="py-10 text-center opacity-40 text-xs font-mono">No hay reparaciones pendientes</div>
          ) : (
            urgentes.map((o) => (
              <div key={o.id} className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0 group">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  o.estado === 'reparacion' ? 'bg-[var(--blue)]' : 
                  o.estado === 'esperando_repuesto' ? 'bg-[var(--orange)]' :
                  o.estado === 'no_reparable' ? 'bg-[var(--red)]' :
                  'bg-[var(--yellow)]'
                }`} />
                <div className="flex-1">
                  <div className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {o.equipo.modelo} · {o.problema}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text3)]">Cliente: {o.cliente.nombre}</div>
                </div>
                <div className="font-mono text-[10px] text-[var(--text3)]">
                  {formatDistanceToNow(new Date(o.created_at), { addSuffix: true, locale: es })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity (Mock Chart Visual) */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4.5 overflow-hidden relative">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-sm font-extrabold text-[var(--text)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" /> 
              Frecuencia de ingresos
            </div>
          </div>
          
          <div className="flex items-end gap-1 h-[60px] mt-4">
             {[0.4, 0.6, 0.45, 0.75, 0.9, 0.7, 1.0].map((h, i) => (
               <div 
                 key={i}
                 className={`flex-1 rounded-t-sm transition-all duration-500 hover:opacity-100 ${i === 6 ? 'bg-[var(--accent)]' : 'bg-[var(--border2)] opacity-70'}`}
                 style={{ height: `${h * 100}%` }}
               />
             ))}
          </div>
          <div className="flex gap-1 mt-1.5">
            {['L','M','X','J','V','S','D'].map(d => (
              <div key={d} className="flex-1 text-center font-mono text-[9px] text-[var(--text3)]">{d}</div>
            ))}
          </div>

          <div className="flex gap-6 mt-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[var(--text3)] uppercase uppercase tracking-[1px]">Total</span>
              <span className="text-lg font-extrabold text-[var(--text)] tracking-[-0.5px]">{ordenes.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[var(--text3)] uppercase uppercase tracking-[1px]">Completadas</span>
              <span className="text-lg font-extrabold text-[var(--accent)] tracking-[-0.5px]">{ordenes.filter(o => o.estado === 'entregado').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string, value: string | number, sub: string, color: string }) {
  const colorMap: any = {
    accent: "before:from-[var(--accent)]",
    blue: "before:from-[var(--blue)]",
    yellow: "before:from-[var(--yellow)]",
    red: "before:from-[var(--red)]"
  };

  return (
    <div className={`bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:to-transparent ${colorMap[color]}`}>
      <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
        {label}
      </div>
      <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
        {value}
      </div>
      <div className="text-[11px] font-mono text-[var(--text3)] mt-1.5">
        {sub}
      </div>
    </div>
  );
}
