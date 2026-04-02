"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Loader2, TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

export default function StatsPage() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch("/ordenes");
        setOrdenes(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const porEstado = {
    ingresado: ordenes.filter(o => o.estado === "ingresado").length,
    reparacion: ordenes.filter(o => o.estado === "reparacion").length,
    listo: ordenes.filter(o => o.estado === "listo").length,
    entregado: ordenes.filter(o => o.estado === "entregado").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 opacity-50">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        <div className="text-sm font-mono uppercase tracking-[2px]">Calculando Estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Estadísticas</h1>
        <p className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Rendimiento y métricas del taller</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución por Estado */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-[var(--accent)]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">Distribución por Estado</span>
          </div>
          
          <div className="space-y-4">
            <StatRow label="Ingresados" value={porEstado.ingresado} total={ordenes.length} color="bg-[var(--yellow)]" />
            <StatRow label="En Reparación" value={porEstado.reparacion} total={ordenes.length} color="bg-[var(--blue)]" />
            <StatRow label="Listos para Retiro" value={porEstado.listo} total={ordenes.length} color="bg-[var(--accent)]" />
            <StatRow label="Entregados" value={porEstado.entregado} total={ordenes.length} color="bg-[var(--text3)]" />
          </div>
        </div>

        {/* Resumen General */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-[var(--accent)]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">Resumen de Operación</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1 items-center">
            <div className="text-center">
              <div className="text-xs font-mono text-[var(--text3)] uppercase mb-1">Total Histórico</div>
              <div className="text-4xl font-black text-[var(--text)]">{ordenes.length}</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-mono text-[var(--text3)] uppercase mb-1">Eficiencia</div>
              <div className="text-4xl font-black text-[var(--accent)]">
                {ordenes.length > 0 ? Math.round((porEstado.entregado / ordenes.length) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-mono text-[var(--text2)] mb-1.5">
        <span>{label}</span>
        <span>{value} ({Math.round(percentage)}%)</span>
      </div>
      <div className="w-full h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
