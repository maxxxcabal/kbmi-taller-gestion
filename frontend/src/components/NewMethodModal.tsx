"use client";

import React, { useState } from 'react';
import { X, Book, Hash, AlignLeft } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface NewMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewMethodModal: React.FC<NewMethodModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    tags: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.contenido) return;
    
    setIsSubmitting(true);
    try {
      await apiFetch('/conocimiento/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      onSuccess();
      onClose();
      setFormData({ titulo: '', contenido: '', tags: '' });
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al guardar el método.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
      <div className="bg-[var(--sidebar)] border border-[var(--border)] w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center text-[var(--accent)]">
               <Book size={18} />
             </div>
             <div>
               <h3 className="text-sm font-extrabold text-[var(--text)]">Nuevo Método de Reparación</h3>
               <p className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-wider">Aporta a la base de IA</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--card)] rounded-full text-[var(--text3)] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase flex items-center gap-1.5">
              <Hash size={12} /> Título / Modelo
            </label>
            <input 
              type="text" 
              className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
              placeholder="Ej: iPhone 13 Pro Max - Reemplazo de Pantalla"
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase flex items-center gap-1.5">
              <AlignLeft size={12} /> Procedimiento / Tip
            </label>
            <textarea 
              rows={6}
              className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors resize-none leading-relaxed"
              placeholder="Escribe los pasos, voltajes, archivos necesarios, etc..."
              value={formData.contenido}
              onChange={e => setFormData({...formData, contenido: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase flex items-center gap-1.5">
              <Hash size={12} /> Etiquetas (opcional)
            </label>
            <input 
              type="text" 
              className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
              placeholder="frp, icloud, hardware, etc..."
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border)] flex items-center justify-end bg-[var(--card)]/50 gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-xs font-bold text-[var(--text2)] hover:text-[var(--text)] transition-colors">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.titulo || !formData.contenido}
            className={`bg-[var(--accent)] text-[var(--bg)] px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-[var(--accent-dim)] ${isSubmitting || !formData.titulo || !formData.contenido ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00ffca]'}`}
          >
            {isSubmitting ? 'Guardando e Indexando...' : 'Guardar Método'}
          </button>
        </div>
      </div>
    </div>
  );
};
