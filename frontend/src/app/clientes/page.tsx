"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Loader2, User, Phone, Search, Plus } from "lucide-react";

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  tenant_id: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await apiFetch("/clientes/");
        setClientes(data);
      } catch (err) {
        console.error("Error fetching clientes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const filtered = Array.isArray(clientes) ? clientes.filter(c => 
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono && c.telefono.includes(search))
  ) : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 opacity-50">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        <div className="text-sm font-mono uppercase tracking-[2px]">Cargando Clientes...</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Clientes</h1>
          <p className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Gestión de base de datos de clientes</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text3)]" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o tel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[var(--sidebar)] border border-[var(--border)] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-all w-[240px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] rounded-xl opacity-40">
            <User size={40} className="mx-auto mb-4" />
            <div className="text-sm font-mono">No se encontraron clientes</div>
          </div>
        ) : (
          filtered.map((cliente) => (
            <div key={cliente.id} className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border2)] transition-all group relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--card)] flex items-center justify-center text-[var(--accent)] font-bold text-lg border border-[var(--border)] group-hover:border-[var(--accent)] transition-all">
                  {cliente.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-[var(--text)] truncate">{cliente.nombre}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text3)] font-mono mt-1">
                    <Phone size={12} className="text-[var(--accent)]" /> {cliente.telefono || "Sin teléfono"}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
