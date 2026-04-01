"use client";

import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, FileText, MessageCircle, Image, CheckCircle2, RotateCcw } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState<any>({
    nombre_taller: '',
    direccion: '',
    telefono: '',
    email: '',
    mensaje_recibo: '',
    mensaje_whatsapp_recepcion: '',
    mensaje_whatsapp_listo: '',
    logo_url: ''
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/config/');
      setConfig(data);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const { id, ...updateData } = config;
      await apiFetch('/config/', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">Configuración</h1>
          <p className="text-xs text-[var(--text3)] font-mono uppercase tracking-wider mt-1">Personaliza tu taller y mensajes</p>
        </div>
        
        {success && (
          <div className="flex items-center gap-2 text-[var(--accent)] bg-[var(--accent-dim)] px-4 py-2 rounded-xl border border-[rgba(0,184,141,0.2)] animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold">Cambios guardados con éxito</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-6 uppercase tracking-widest font-bold">
              <Package size={14} /> Información del Taller
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Nombre del Taller</label>
                <input 
                  type="text"
                  className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all font-bold"
                  value={config.nombre_taller}
                  onChange={e => setConfig({...config, nombre_taller: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Dirección</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                  <input 
                    type="text"
                    className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
                    value={config.direccion}
                    onChange={e => setConfig({...config, direccion: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Teléfono</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all font-mono"
                      value={config.telefono}
                      onChange={e => setConfig({...config, telefono: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Email (Opcional)</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                    <input 
                      type="email"
                      className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all"
                      value={config.email || ''}
                      onChange={e => setConfig({...config, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-6 uppercase tracking-widest font-bold">
              <FileText size={14} /> Mensaje en Comprobante
            </h3>
            <textarea 
              className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl p-4 text-xs text-[var(--text2)] outline-none focus:border-[var(--accent)] transition-all min-h-[100px] resize-none leading-relaxed"
              value={config.mensaje_recibo}
              onChange={e => setConfig({...config, mensaje_recibo: e.target.value})}
              placeholder="Ej: Garantía de 30 días. No cubre golpes o agua."
            />
          </section>
        </div>

        {/* WhatsApp Config */}
        <div className="space-y-6">
          <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#25D366] font-mono text-[10px] mb-6 uppercase tracking-widest font-bold">
              <MessageCircle size={14} /> Mensajes Automáticos WhatsApp
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-mono text-[var(--text3)] mb-2 uppercase tracking-wider">Mensaje al Recibir Equipo</label>
                <textarea 
                  className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl p-4 text-xs text-[var(--text2)] outline-none focus:border-[var(--accent)] transition-all min-h-[80px] resize-none leading-relaxed"
                  value={config.mensaje_whatsapp_recepcion}
                  onChange={e => setConfig({...config, mensaje_whatsapp_recepcion: e.target.value})}
                />
                <p className="text-[10px] text-[var(--text3)] mt-2 italic">Variables: {'{cliente}'}, {'{equipo}'}, {'{link}'}</p>
              </div>

              <div className="border-t border-[var(--border)] pt-6">
                <label className="block text-[10px] font-mono text-[var(--text3)] mb-2 uppercase tracking-wider">Mensaje cuando está LISTO</label>
                <textarea 
                  className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-xl p-4 text-xs text-[var(--text2)] outline-none focus:border-[var(--accent)] transition-all min-h-[80px] resize-none leading-relaxed"
                  value={config.mensaje_whatsapp_listo}
                  onChange={e => setConfig({...config, mensaje_whatsapp_listo: e.target.value})}
                />
                <p className="text-[10px] text-[var(--text3)] mt-2 italic">Variables: {'{cliente}'}, {'{equipo}'}, {'{precio}'}</p>
              </div>
            </div>
          </section>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-[var(--accent)] text-[var(--bg)] py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#00ffca] hover:-translate-y-1 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            Guardar Configuración
          </button>
        </div>

      </form>
    </div>
  );
}

// Custom icons since 'lucide-react' doesn't have 'Shop' in standard names always
const Package = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
