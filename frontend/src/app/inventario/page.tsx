"use client";

import { Plus } from "lucide-react";

export default function InventarioPage() {
  return (
    <div className="animate-in fade-in flex flex-col gap-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3.5">
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--accent)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Total productos
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            47
          </div>
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--red)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Stock crítico
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            3
          </div>
          <div className="text-[11px] font-mono text-[var(--text3)] mt-1.5">
            <span className="text-[var(--red)]">Reponer ya</span>
          </div>
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--accent)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Valor en stock
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            $318k
          </div>
        </div>

        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl py-[18px] px-5 relative overflow-hidden transition-colors hover:border-[var(--border2)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-[var(--yellow)] before:to-transparent">
          <div className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-[1px] mb-2.5">
            Productos en alerta
          </div>
          <div className="text-[28px] font-extrabold text-[var(--text)] tracking-[-1px] leading-none">
            5
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-[var(--text)] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" /> 
          Stock de repuestos y accesorios
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-sans text-xs font-bold cursor-pointer transition-all bg-[var(--accent)] text-[var(--bg)] hover:bg-[#00ffca] hover:-translate-y-[1px]">
          <Plus size={14} />
          Agregar producto
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        
        {/* Item 1 low */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4 transition-colors hover:border-[var(--border2)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[13px] font-bold">Pantalla Samsung A54</div>
              <div className="text-[11px] font-mono text-[var(--text3)] mt-0.5">Original OLED · Comp: A54 5G</div>
            </div>
            <div className="text-[22px] font-extrabold tracking-[-0.5px] text-[var(--red)]">2</div>
          </div>
          <div className="h-1 bg-[var(--bg3)] rounded-sm my-2.5 overflow-hidden">
            <div className="h-full rounded-sm bg-[var(--red)] transition-all ease-out" style={{ width: '10%' }}></div>
          </div>
          <div className="font-mono text-[11px] text-[var(--text3)]">
            Costo: <span className="text-[var(--text2)]">$8.200</span> · Venta: <span className="text-[var(--text2)]">$14.500</span>
          </div>
        </div>

        {/* Item 2 ok */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4 transition-colors hover:border-[var(--border2)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[13px] font-bold">Batería Redmi 12</div>
              <div className="text-[11px] font-mono text-[var(--text3)] mt-0.5">BN5E 5000mAh</div>
            </div>
            <div className="text-[22px] font-extrabold tracking-[-0.5px] text-[var(--accent)]">8</div>
          </div>
          <div className="h-1 bg-[var(--bg3)] rounded-sm my-2.5 overflow-hidden">
            <div className="h-full rounded-sm bg-[var(--accent)] transition-all ease-out" style={{ width: '53%' }}></div>
          </div>
          <div className="font-mono text-[11px] text-[var(--text3)]">
            Costo: <span className="text-[var(--text2)]">$1.800</span> · Venta: <span className="text-[var(--text2)]">$3.200</span>
          </div>
        </div>

        {/* Item 3 ok */}
        <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4 transition-colors hover:border-[var(--border2)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[13px] font-bold">Cable USB-C 1m</div>
              <div className="text-[11px] font-mono text-[var(--text3)] mt-0.5">Venta accesorio</div>
            </div>
            <div className="text-[22px] font-extrabold tracking-[-0.5px] text-[var(--accent)]">23</div>
          </div>
          <div className="h-1 bg-[var(--bg3)] rounded-sm my-2.5 overflow-hidden">
            <div className="h-full rounded-sm bg-[var(--accent)] transition-all ease-out" style={{ width: '76%' }}></div>
          </div>
          <div className="font-mono text-[11px] text-[var(--text3)]">
            Costo: <span className="text-[var(--text2)]">$350</span> · Venta: <span className="text-[var(--text2)]">$900</span>
          </div>
        </div>

        {/* Create new */}
        <div className="border border-dashed border-[var(--border2)] rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[100px] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]">
          <div className="opacity-40 text-[var(--text)]"><Plus size={20} /></div>
          <div className="text-xs font-bold text-[var(--text3)]">Nuevo producto</div>
        </div>

      </div>
    </div>
  );
}
