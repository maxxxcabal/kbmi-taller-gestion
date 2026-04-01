"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Sparkles, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NewMethodModal } from "@/components/NewMethodModal";

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const data = await apiFetch(`/conocimiento/buscar?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-6 pb-12">
      
      {/* AI Search Box */}
      <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-[14px] p-5 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_0%_0%,rgba(0,229,176,0.05)_0%,transparent_60%)] before:pointer-events-none">
        <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[1.5px] mb-2.5 flex items-center gap-1.5 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--accent)] before:shadow-[0_0_10px_var(--accent)]">
          Búsqueda con IA (Semántica)
        </div>
        <div className="flex gap-2.5 items-center">
          <input 
            type="text"
            className="flex-1 bg-[var(--card)] border border-[var(--border2)] rounded-[9px] px-3.5 py-2.5 font-mono text-[13px] text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] placeholder:text-[var(--text3)]"
            placeholder="Ej: Samsung A12 FRP binario 5 · Redmi sin arrancar · iPhone iCloud bypass…" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-xs font-bold cursor-pointer transition-all bg-[var(--accent)] text-[var(--bg)] hover:bg-[#00ffca] hover:-translate-y-[1px] disabled:opacity-50"
          >
            {isLoading ? <div className="animate-spin"><Sparkles size={14} /></div> : <Search size={14} />}
            Buscar con IA
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {results.length > 0 ? results.map((item) => (
          <div key={item.id} className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4.5 cursor-pointer transition-all hover:border-[var(--border2)] hover:-translate-y-0.5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-base font-extrabold text-[var(--text)] tracking-[-0.5px] flex items-center gap-2">
                  {item.titulo}
                  {item.score > 0.8 && <Sparkles size={14} className="text-[var(--accent)]" />}
                </div>
                <div className="font-mono text-[10px] text-[var(--text3)] mt-1">
                  Relevancia: <span className="text-[var(--accent)] font-bold">{(item.score * 100).toFixed(0)}%</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.5px] bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(0,184,141,0.2)]">
                {item.tags || 'General'}
              </span>
            </div>
            <div className="text-xs text-[var(--text2)] leading-relaxed mb-3.5 bg-[var(--bg)]/50 p-3 rounded-lg border border-[var(--border)]">
              {item.contenido}
            </div>
            <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-[var(--border)]">
              <div className="font-mono text-[11px] text-[var(--text3)] flex items-center gap-1.5 uppercase">
                <BookOpen size={12} /> Guía Paso a paso
              </div>
              <div className="font-mono text-[10px] text-[var(--text3)]">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center opacity-30 select-none">
             <BookOpen size={48} className="mb-4" />
             <p className="text-sm font-mono uppercase tracking-[2px]">Realiza una búsqueda inteligente</p>
          </div>
        )}

        {/* Add New Button */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="border border-dashed border-[var(--border2)] rounded-xl cursor-pointer flex items-center justify-center min-h-[160px] flex-col gap-2.5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] group"
        >
          <div className="opacity-40 text-[var(--text)] group-hover:scale-110 transition-transform"><Plus size={24} /></div>
          <div className="text-[13px] font-bold text-[var(--text3)] group-hover:text-[var(--accent)] transition-colors">Agregar nuevo método</div>
          <div className="text-[11px] font-mono text-[var(--text3)] opacity-60">Guardá lo que funcionó hoy</div>
        </div>

      </div>

      <NewMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
           // Opcional: refrescar o mostrar toast
           alert("¡Método guardado e indexado por la IA!");
        }}
      />
    </div>
  );
}
