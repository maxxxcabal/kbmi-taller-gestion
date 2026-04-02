"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { 
  Wrench, 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Brain, 
  Settings, 
  ShoppingCart, 
  Package, 
  BarChart,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname() || "/";
  const [config, setConfig] = useState<any>(null);

  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'maxireloco94@gmail.com';

  useEffect(() => {
    apiFetch('/config/').then(setConfig).catch(console.error);
  }, []);

  const getNavItemClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    return `flex items-center gap-[9px] px-2 py-[7px] rounded-[7px] cursor-pointer text-[13px] font-semibold transition-all mb-[1px] ${
      isActive
        ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(0,184,141,0.2)] dark:border-[rgba(0,229,176,0.2)]"
        : "text-[var(--text2)] hover:bg-[var(--card)] hover:text-[var(--text)] border border-transparent"
    }`;
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] md:w-[220px] md:min-w-[220px] bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col p-0 overflow-y-auto h-full text-white transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      {/* Logo Section */}
      <div className="px-[18px] py-6 pb-5 border-b border-[var(--border)] relative">
        {onClose && (
          <button onClick={onClose} className="absolute right-4 top-6 text-[var(--text3)] hover:text-white md:hidden">
            <X size={20} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-[1px] text-2xl font-black tracking-tighter leading-none">
              <span className="text-[#e31e24]">k</span>
              <span className="text-[#f15a24]">b</span>
              <span className="text-[#fbb03b]">m</span>
              <span className="text-[#00aeef]">i</span>
            </div>
            <div className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-[2px] mt-1 ml-[2px]">
              Reparaciones
            </div>
          </div>
        </div>
        <div className="text-[8px] font-mono text-[var(--text3)] opacity-50 mt-3 px-[2px] uppercase tracking-widest">
          v1.0 — Taller {config?.nombre_taller?.split(' ')[1] ? `— ${config.nombre_taller.split(' ')[1]}` : ''}
        </div>
      </div>

      {/* Nav Sections */}
      <div className="p-2.5 pt-3.5 pb-1">
        <div className="text-[9px] font-mono text-[var(--text3)] uppercase tracking-[1.5px] px-2 mb-1">Principal</div>
        <Link href="/" className={getNavItemClass("/")}>
          <LayoutDashboard size={16} className="text-center w-4" /> Dashboard
        </Link>
        <Link href="/ordenes" className={getNavItemClass("/ordenes")}>
          <ClipboardList size={16} className="text-center w-4" /> Órdenes
          <span className="ml-auto bg-[var(--red)] text-white text-[9px] font-mono font-bold px-[5px] py-[1px] rounded-[10px]">7</span>
        </Link>
        <Link href="/clientes" className={getNavItemClass("/clientes")}>
          <Users size={16} className="text-center w-4" /> Clientes
        </Link>
      </div>

      <div className="p-2.5 pt-3.5 pb-1">
        <div className="text-[9px] font-mono text-[var(--text3)] uppercase tracking-[1.5px] px-2 mb-1">Técnico</div>
        <Link href="/kb" className={getNavItemClass("/kb")}>
          <Brain size={16} className="text-center w-4" /> Base Conocimiento
        </Link>
        {isAdmin ? (
          <Link href="/settings" className={getNavItemClass("/settings")}>
            <Settings size={16} className="text-center w-4" /> Configuración
          </Link>
        ) : (
          <div className="flex items-center gap-[9px] px-2 py-[7px] text-[13px] font-semibold text-[var(--text3)] opacity-40 cursor-not-allowed">
            <Settings size={16} className="text-center w-4" /> Configuración (🔒)
          </div>
        )}
      </div>

      <div className="p-2.5 pt-3.5 pb-1">
        <div className="text-[9px] font-mono text-[var(--text3)] uppercase tracking-[1.5px] px-2 mb-1">Negocio</div>
        {isAdmin ? (
          <>
            <Link href="/pos" className={getNavItemClass("/pos")}>
              <ShoppingCart size={16} className="text-center w-4" /> Punto de Venta
            </Link>
            <Link href="/inventario" className={getNavItemClass("/inventario")}>
              <Package size={16} className="text-center w-4" /> Inventario
              <span className="ml-auto bg-[var(--accent)] text-[var(--bg)] text-[9px] font-mono font-bold px-[5px] py-[1px] rounded-[10px]">3</span>
            </Link>
            <Link href="/stats" className={getNavItemClass("/stats")}>
              <BarChart size={16} className="text-center w-4" /> Estadísticas
            </Link>
          </>
        ) : (
           <div className="px-2 py-4 bg-[var(--bg2)] rounded-lg border border-[var(--border)] text-[10px] font-mono text-[var(--text3)] leading-tight text-center">
             Módulos de Negocio bloqueados en <span className="text-[var(--accent)]">MODO DEMO</span>
           </div>
        )}
      </div>

      {/* Footer User */}
      <div className="mt-auto p-2.5 py-3 border-t border-[var(--border)]">
        <div 
          onClick={() => confirm("¿Cerrar sesión?") && signOut()}
          className="flex items-center gap-[9px] p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--card)]"
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-[var(--bg)] shrink-0 ${isAdmin ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)]' : 'bg-slate-600'}`}>
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-[var(--text)] truncate">{session?.user?.name || 'Usuario'}</div>
            <div className={`text-[10px] font-mono uppercase tracking-tighter ${isAdmin ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}`}>
              {isAdmin ? 'Admin · Dueño' : 'Modo Demo'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
