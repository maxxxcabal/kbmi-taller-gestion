"use client";

import { useState } from "react";

export default function POSPage() {
  const [cart, setCart] = useState<{name: string, price: number, qty: number}[]>([]);

  const addToCart = (name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === name);
      if (existing) {
        return prev.map(item => item.name === name ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { name, price, qty: 1 }];
    });
  };

  const clearCart = () => setCart([]);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Math.round(subtotal * 0.05); // 5% discount for cash
  const total = subtotal - discount;

  return (
    <div className="animate-in fade-in h-full grid grid-cols-[1fr_340px] gap-4">
      
      {/* Products Selection */}
      <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4.5 overflow-y-auto">
        <div className="text-sm font-extrabold text-[var(--text)] flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" /> 
          Productos
        </div>
        <div className="font-mono text-[10px] text-[var(--text3)] mb-4">Hacé click para agregar al carrito</div>
        
        <div className="grid grid-cols-3 gap-2.5">
          <div onClick={() => addToCart('Cable USB-C', 900)} className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-3.5 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5">
            <div className="text-2xl mb-2">🔌</div>
            <div className="text-xs font-bold mb-1">Cable USB-C</div>
            <div className="font-mono text-xs text-[var(--accent)]">$900</div>
          </div>
          <div onClick={() => addToCart('Cargador 20W', 2800)} className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-3.5 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xs font-bold mb-1">Cargador 20W</div>
            <div className="font-mono text-xs text-[var(--accent)]">$2.800</div>
          </div>
          <div onClick={() => addToCart('Vidrio templado', 800)} className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-3.5 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="text-xs font-bold mb-1">Vidrio templado</div>
            <div className="font-mono text-xs text-[var(--accent)]">$800</div>
          </div>
          <div onClick={() => addToCart('Auriculares', 1500)} className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-3.5 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5">
            <div className="text-2xl mb-2">🎧</div>
            <div className="text-xs font-bold mb-1">Auriculares</div>
            <div className="font-mono text-xs text-[var(--accent)]">$1.500</div>
          </div>
          <div onClick={() => addToCart('Funda silicona', 650)} className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-3.5 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-xs font-bold mb-1">Funda silicona</div>
            <div className="font-mono text-xs text-[var(--accent)]">$650</div>
          </div>
          <div onClick={() => addToCart('Adaptador USB', 700)} className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-3.5 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-xs font-bold mb-1">Adaptador USB</div>
            <div className="font-mono text-xs text-[var(--accent)]">$700</div>
          </div>
        </div>
      </div>

      {/* Cart Pane */}
      <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-xl p-4.5 flex flex-col h-full overflow-hidden">
        <div className="text-sm font-extrabold text-[var(--text)] flex items-center gap-2 mb-3.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" /> 
          Carrito
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col pt-2 border-t border-[var(--border)]">
          {cart.length === 0 ? (
            <div className="text-[var(--text3)] font-mono text-xs text-center py-5 m-auto">Agregá productos →</div>
          ) : (
            <div className="flex flex-col gap-0">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-[var(--border)]">
                  <div className="flex-1 text-xs font-bold">{item.name}</div>
                  <div className="font-mono text-xs text-[var(--text2)] bg-[var(--bg3)] px-2 py-0.5 rounded-[5px]">x{item.qty}</div>
                  <div className="font-mono text-xs text-[var(--accent)]">${item.price * item.qty}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3.5 border-t border-[var(--border2)] mt-2">
          <div className="flex justify-between mb-1.5 text-xs text-[var(--text2)] font-mono">
            <span>Subtotal</span><span>${subtotal}</span>
          </div>
          <div className="flex justify-between mb-1.5 text-xs text-[var(--text2)] font-mono">
            <span>Efectivo (-5%)</span><span>−${discount}</span>
          </div>
          <div className="flex justify-between text-[20px] font-extrabold text-[var(--text)] my-3 tracking-[-0.5px]">
            <span>Total</span><span>${total}</span>
          </div>
          
          <button 
            disabled={cart.length === 0}
            className={`flex items-center justify-center w-full px-3.5 py-3 rounded-lg font-sans text-sm font-bold transition-all ${cart.length === 0 ? 'bg-[var(--border2)] text-[var(--text3)] cursor-not-allowed' : 'bg-[var(--accent)] text-[var(--bg)] cursor-pointer hover:bg-[#00ffca]'}`}
          >
            Cobrar →
          </button>
          
          <button 
            onClick={clearCart} 
            disabled={cart.length === 0}
            className="flex items-center justify-center w-full mt-2 p-2 rounded-lg font-sans text-xs bg-transparent text-[var(--text2)] border border-[var(--border)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </div>

    </div>
  );
}
