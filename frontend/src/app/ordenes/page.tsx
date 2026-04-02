"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Orden {
  id: string;
  codigo: string;
  cliente_nombre: string;
  equipo_modelo: string;
  problema: string;
  estado: string;
  precio: number;
  created_at: string;
}

import { OrderDetailModal } from "@/components/OrderDetailModal";

import { useSearchParams } from "next/navigation";

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todas");
  const [activeTab, setActiveTab] = useState<"activas" | "historial">("activas");
  const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const url = query ? `/ordenes?q=${encodeURIComponent(query)}` : "/ordenes";
      const data = await apiFetch(url);
      const formatted = data.map((o: any) => ({
        id: o.id,
        codigo: o.codigo,
        cliente_nombre: o.cliente?.nombre || "N/A",
        equipo_modelo: `${o.equipo?.marca || ''} ${o.equipo?.modelo || ''}`.trim() || "Desconocido",
        problema: o.problema || "Sin descripción",
        estado: o.estado,
        precio: o.precio,
        created_at: o.created_at
      }));
      setOrdenes(formatted);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, [query]);

  const openOrder = (id: string | number) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const stats = {
    ingresado: ordenes.filter(o => o.estado === "ingresado").length,
    diagnostico: ordenes.filter(o => o.estado === "diagnostico").length,
    reparacion: ordenes.filter(o => o.estado === "reparacion").length,
    listo: ordenes.filter(o => o.estado === "listo").length
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--accent)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Ingresado
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            {stats.ingresado}
          </div>
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--yellow)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Diagnóstico / Rep.
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            {stats.diagnostico}
          </div>
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--blue)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            En reparación
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            {stats.reparacion}
          </div>
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--accent)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Listo p/ retirar
          </div>
          <div className="text-[28px] font-extrabold text-[var(--accent)] tracking-[-1px] leading-none">
            {stats.listo}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-1">
            <button 
              onClick={() => { setActiveTab("activas"); setFilter("Todas"); }}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "activas" ? 'bg-[var(--accent)] text-[var(--bg)] shadow-lg' : 'text-[var(--text3)] hover:text-[var(--text)]'}`}
            >
              Órdenes Activas
            </button>
            <button 
              onClick={() => { setActiveTab("historial"); setFilter("Todas"); }}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "historial" ? 'bg-[var(--accent)] text-[var(--bg)] shadow-lg' : 'text-[var(--text3)] hover:text-[var(--text)]'}`}
            >
              Historial Completo
            </button>
          </div>

          <div className="flex gap-2">
            {(activeTab === "activas" 
              ? ["Todas", "ingresado", "reparacion", "listo"] 
              : ["Todas", "entregado", "devuelto", "no_reparable"]
            ).map((s) => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3.5 py-1 text-[11px] font-mono rounded-[20px] transition-colors ${
                  filter === s 
                  ? "border border-[rgba(0,184,141,0.3)] bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "border border-[var(--border)] bg-[var(--sidebar)] text-[var(--text2)] hover:bg-[var(--accent-dim)] hover:border-[rgba(0,184,141,0.3)] hover:text-[var(--accent)]"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[2px] mb-3 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
          {activeTab === "activas" ? "Reparaciones en taller" : "Registros históricos y entregados"}
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
              <div className="text-xs font-mono uppercase tracking-[1px]">Cargando órdenes...</div>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
              <div className="text-sm font-mono uppercase tracking-[1px]">No hay órdenes registradas</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--card)] border-b border-[var(--border)]">
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold border-r border-[var(--border)]">Código</th>
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold">Dispositivo</th>
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold">Cliente</th>
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold">Problema</th>
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold">Fecha</th>
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold">Precio</th>
                  <th className="font-mono text-[10px] font-medium text-[var(--text3)] uppercase tracking-[1px] py-3.5 px-4 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes
                  .filter(o => {
                    const isHistorical = ["entregado", "devuelto", "no_reparable"].includes(o.estado);
                    if (activeTab === "activas") return !isHistorical && (filter === "Todas" || o.estado === filter);
                    return isHistorical && (filter === "Todas" || o.estado === filter);
                  })
                  .map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => openOrder(order.id)}
                      className="border-b border-[var(--border)] transition-colors hover:bg-[var(--card)] cursor-pointer group"
                    >
                      <td className="py-3 px-4 align-middle font-mono text-[13px] text-[var(--accent)] font-bold border-r border-[var(--border)]">
                        {order.codigo}
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[var(--bg4)] border border-[var(--border)] flex items-center justify-center text-sm shrink-0 uppercase font-bold text-[var(--text3)]">
                            {order.equipo_modelo.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[13px] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{order.equipo_modelo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle text-[13px] text-[var(--text)]">{order.cliente_nombre}</td>
                      <td className="py-3 px-4 align-middle text-[12px] text-[var(--text2)] max-w-[200px] truncate">{order.problema}</td>
                      <td className="py-3 px-4 align-middle font-mono text-[11px] text-[var(--text3)]">
                        {format(new Date(order.created_at), "dd/MM HH:mm", { locale: es })}
                      </td>
                      <td className="py-3 px-4 align-middle font-mono text-[12px] text-[var(--accent)] font-bold">
                        ${(order.precio || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <StatusBadge estado={order.estado} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <OrderDetailModal 
        isOpen={isModalOpen}
        orderId={selectedOrderId}
        onClose={() => setIsModalOpen(false)}
        onUpdate={fetchOrdenes}
      />
    </div>
  );
}

function StatusBadge({ estado }: { estado: string }) {
  const styles: any = {
    ingresado: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    diagnostico: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    esperando_repuesto: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    en_reparacion: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    listo: "bg-[var(--accent-dim)] text-[var(--accent)] border-[rgba(0,184,141,0.2)]",
    entregado: "bg-green-500/10 text-green-500 border-green-500/20",
    no_reparable: "bg-red-500/10 text-red-500 border-red-500/20",
    devuelto: "bg-slate-700/10 text-slate-400 border-slate-700/20",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.5px] whitespace-nowrap border before:content-[''] before:block before:w-[5px] before:h-[5px] before:rounded-full before:bg-current ${styles[estado] || styles.ingresado}`}>
      {estado.replace('_', ' ')}
    </span>
  );
}
