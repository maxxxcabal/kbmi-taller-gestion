"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Plus, Wrench, Menu } from "lucide-react";
import { NewOrderModal } from "./NewOrderModal";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(searchParams);
      if (searchValue) {
        params.set('q', searchValue);
      } else {
        params.delete('q');
      }
      
      if (pathname !== '/ordenes' && pathname !== '/') {
        router.push(`/ordenes?${params.toString()}`);
      } else {
        router.push(`${pathname}?${params.toString()}`);
      }
    }
  };

  return (
    <div className="h-[54px] border-b border-[var(--border)] flex items-center px-4 md:px-6 gap-3 md:gap-4 shrink-0 bg-[var(--sidebar)] w-full sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden w-8 h-8 rounded bg-[var(--card)] flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] transition-colors mr-1"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="hidden sm:flex w-6 h-6 rounded bg-[var(--accent-dim)] items-center justify-center text-[var(--accent)]">
          <Wrench size={14} />
        </div>
        <div className="text-[14px] sm:text-[15px] font-extrabold text-[var(--text)] tracking-[-0.3px] truncate max-w-[120px] sm:max-w-none">
          {pathname === '/' ? 'Dashboard' : pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(1)}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-[6px] sm:gap-[10px]">
        
        {/* Search Box */}
        <div className="hidden md:flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-1.5 focus-within:border-[var(--accent)] transition-all group">
          <Search size={14} className="text-[var(--text3)] group-focus-within:text-[var(--accent)]" />
          <input 
            type="text" 
            placeholder="Buscar cliente, IMEI..." 
            className="bg-transparent border-none outline-none font-mono text-[11px] text-[var(--text)] w-[180px] placeholder:text-[var(--text3)]"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* New Order Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-sans text-xs font-bold cursor-pointer transition-all bg-[var(--accent)] text-[var(--bg)] hover:bg-[#00ffca] hover:-translate-y-[1px]"
        >
          <Plus size={14} />
          Nueva Orden
        </button>
      </div>

      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
