"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Clock, AlertCircle, CheckCircle2, Package, Smartphone, User, MessageSquare, DollarSign, Share2, MessageCircle, Link2, Sparkles, Trash2, Lock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSession } from "next-auth/react";

interface OrderDetailModalProps {
  orderId: string | number | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ESTADOS = [
  { id: 'ingresado', label: 'Ingresado', color: 'gray' },
  { id: 'diagnostico', label: 'Diagnóstico', color: 'yellow' },
  { id: 'esperando_repuesto', label: 'Esperando Repuesto', color: 'orange' },
  { id: 'en_reparacion', label: 'En Reparación', color: 'blue' },
  { id: 'listo', label: 'Listo para retirar', color: 'accent' },
  { id: 'entregado', label: 'Entregado', color: 'green' },
  { id: 'no_reparable', label: 'No Reparable', color: 'red' },
  { id: 'devuelto', label: 'Devuelto s/ arreglar', color: 'dark' },
];

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, isOpen, onClose, onUpdate }) => {
  const [order, setOrder] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [copying, setCopying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'maxireloco94@gmail.com';
  const [editData, setEditData] = useState({
    estado: '',
    comentarios: '',
    costo_repuesto: 0,
    precio: 0
  });

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrder();
    }
  }, [isOpen, orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const [orderData, configData] = await Promise.all([
        apiFetch(`/ordenes/${orderId}`),
        apiFetch(`/config/`)
      ]);
      setOrder(orderData);
      setConfig(configData);
      setEditData({
        estado: orderData.estado,
        comentarios: orderData.comentarios || '',
        costo_repuesto: orderData.costo_repuesto || 0,
        precio: orderData.precio || 0
      });
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
    
    // Fetch AI suggestions separately
    setLoadingAI(true);
    try {
      const suggestions = await apiFetch(`/ordenes/${orderId}/ai-suggestion`);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const copyTrackingLink = () => {
    if (!order) return;
    const trackingUrl = `${window.location.origin}/status?token=${order.token_seguimiento}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const sendWhatsApp = (type: 'receipt' | 'ready') => {
    if (!order || !config) return;
    const phone = order.cliente.telefono.replace(/\D/g, '');
    const baseUrl = window.location.origin;
    const receiptUrl = `${baseUrl}/receipt?id=${order.id}`;
    
    let message = "";
    if (type === 'receipt') {
      message = config.mensaje_whatsapp_recepcion
        .replace('{cliente}', order.cliente.nombre)
        .replace('{equipo}', `${order.equipo.marca} ${order.equipo.modelo}`)
        .replace('{link}', receiptUrl);
    } else {
      message = config.mensaje_whatsapp_listo
        .replace('{cliente}', order.cliente.nombre)
        .replace('{equipo}', `${order.equipo.marca} ${order.equipo.modelo}`)
        .replace('{precio}', order.precio.toLocaleString());
    }
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDelete = async () => {
    if (!orderId) {
      alert("Error: ID de orden no encontrado");
      return;
    }
    
    setSaving(true);
    try {
      await apiFetch(`/ordenes/${orderId}`, {
        method: 'DELETE',
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(error instanceof Error ? error.message : "Error al eliminar la orden");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/ordenes/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify(editData),
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
      <div className="bg-[var(--sidebar)] border border-[var(--border)] w-full max-w-[700px] h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--card)]/50">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-[var(--accent-dim)] text-[var(--accent)] font-mono text-xs font-bold rounded-lg border border-[rgba(0,184,141,0.2)]">
              {order?.codigo || 'CARGANDO...'}
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text)]">Detalles de la Orden</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[var(--bg2)] border border-[var(--border)] rounded-[14px] p-2 pr-4 relative">
              {isAdmin ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2.5 rounded-xl hover:bg-red-500/10 text-[var(--text3)] hover:text-red-500 transition-all group relative mr-2"
                  title="Eliminar orden"
                >
                  <Trash2 size={18} />
                </button>
              ) : (
                <div className="p-2.5 opacity-20 cursor-not-allowed group relative mr-2" title="Solo lectura (Modo Demo)">
                  <Lock size={16} />
                </div>
              )}
              
              {showDeleteConfirm && (
                <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-right-4">
                  <span className="text-[10px] font-bold text-red-500 px-2 uppercase tracking-tighter">¿Borrar?</span>
                  <button 
                    onClick={handleDelete}
                    disabled={saving}
                    className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md hover:bg-red-600 transition-colors"
                  >
                    SÍ
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 text-[var(--text3)] text-[10px] font-bold hover:text-[var(--text)] transition-colors"
                  >
                    NO
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[var(--card)] rounded-full text-[var(--text3)] transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 gap-3">
              <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text3)]">Cargando información...</div>
            </div>
          ) : !order ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 gap-3">
              <AlertCircle className="text-[var(--red)]" />
              <div className="text-xs font-bold text-[var(--text3)]">No se pudo cargar la orden.</div>
              <button onClick={fetchOrder} className="text-[10px] text-[var(--accent)] underline">Reintentar</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                {/* Info Section */}
                <div className="space-y-5">
                  <div className="bg-[var(--card)]/50 border border-[var(--border)] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider">
                      <User size={12} /> Cliente
                    </div>
                    <div className="text-sm font-bold text-[var(--text)]">{order.cliente?.nombre || 'N/A'}</div>
                    <div className="text-xs text-[var(--text3)] font-mono">{order.cliente?.telefono || 'N/A'}</div>
                  </div>

                  <div className="bg-[var(--card)]/50 border border-[var(--border)] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider">
                      <Smartphone size={12} /> Dispositivo
                    </div>
                    <div className="text-sm font-bold text-[var(--text)]">{order.equipo?.marca} {order.equipo?.modelo}</div>
                    <div className="text-[10px] text-[var(--text3)] font-mono mt-0.5 uppercase tracking-wide">IMEI: {order.equipo?.imei || 'N/A'}</div>
                    <div className="text-[11px] text-[var(--text2)] mt-3 pt-3 border-t border-[var(--border)]/50">
                      <span className="text-[var(--text3)] font-mono uppercase text-[9px] block mb-1">Falla reportada:</span> 
                      {order.problema}
                    </div>
                  </div>

                  {order.equipo?.pin_patron && (
                    <div className="bg-[var(--accent-dim)]/5 border border-[var(--accent)]/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider">
                        <Package size={12} /> Desbloqueo (Patrón/PIN)
                      </div>
                      {order.equipo.pin_patron.startsWith('data:image') ? (
                        <div className="bg-white rounded-lg p-2 border border-[var(--border2)] inline-block">
                          <img src={order.equipo.pin_patron} alt="Patrón" className="h-20 w-auto object-contain grayscale contrast-125" />
                        </div>
                      ) : (
                        <div className="text-sm font-mono font-bold text-[var(--accent)]">{order.equipo.pin_patron}</div>
                      )}
                    </div>
                  )}

                  <div className="bg-[var(--card)]/50 border border-[var(--border)] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider">
                      <Clock size={12} /> Historial
                    </div>
                    <div className="text-[11px] text-[var(--text2)] flex justify-between">
                      <span>Ingreso:</span>
                      <span className="font-mono">
                        {order.created_at ? format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: es }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[var(--text3)] mb-2 uppercase tracking-wider">Estado de la Reparación</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {ESTADOS.map((est) => (
                        <button
                          key={est.id}
                          onClick={() => { setEditData({ ...editData, estado: est.id }); setIsEditing(true); }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-[11px] font-bold transition-all ${
                            editData.estado === est.id
                              ? 'bg-[var(--accent-dim)] border-[var(--accent)] text-[var(--accent)]'
                              : 'bg-[var(--card)] border-[var(--border)] text-[var(--text3)] hover:border-[var(--text3)]'
                          }`}
                        >
                          {est.label}
                          {editData.estado === est.id && <CheckCircle2 size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Suggestion Section */}
              <div className="bg-[var(--accent-dim)]/20 border border-[var(--accent)]/30 rounded-xl p-4 overflow-hidden relative">
                <div className="absolute -right-4 -top-4 text-[var(--accent)] opacity-5">
                   <Sparkles size={80} />
                </div>
                <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider relative">
                  <Sparkles size={12} /> Sugerencias de FixLab (IA)
                </div>
                
                {loadingAI ? (
                  <div className="text-[10px] text-[var(--text3)] flex items-center gap-2">
                    <div className="w-3 h-3 border border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                    Buscando en la base de conocimientos...
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {aiSuggestions.map((sug, idx) => (
                      <div key={idx} className="bg-[var(--card)]/40 p-3 rounded-lg border border-[var(--border)] relative group">
                        <div className="text-[11px] font-bold text-[var(--text)] mb-1">{sug.titulo}</div>
                        <div className="text-[10px] text-[var(--text2)] line-clamp-2 md:line-clamp-none">{sug.contenido}</div>
                        <div className="mt-2 flex items-center justify-between">
                           <span className="text-[9px] font-mono text-[var(--accent)] opacity-70">Similitud: {Math.round(sug.score * 100)}%</span>
                           {(sug.precio_estimado || 0) > 0 && (
                             <span className="text-[10px] font-bold text-[var(--text)]">${sug.precio_estimado.toLocaleString()}</span>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-[var(--text3)] italic">No se encontraron sugerencias específicas para este problema.</div>
                )}
              </div>

              {/* Technical Comments */}
              <div className="bg-[var(--card)]/50 border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider">
                  <MessageSquare size={12} /> Notas Técnicas y Comentarios
                </div>
                <textarea 
                  className="w-full bg-[var(--bg2)] border border-[var(--border2)] rounded-lg p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors min-h-[100px] resize-none"
                  placeholder="Escribe aquí los detalles del diagnóstico, si falta algún repuesto o el motivo de la demora..."
                  value={editData.comentarios}
                  onChange={(e) => { setEditData({ ...editData, comentarios: e.target.value }); setIsEditing(true); }}
                />
              </div>

              {/* Photos Grid */}
              {(() => {
                try {
                  const fotos = order.fotos ? JSON.parse(order.fotos) : [];
                  if (fotos.length > 0) {
                    return (
                      <div className="bg-[var(--card)]/50 border border-[var(--border)] rounded-xl p-4">
                        <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] mb-3 uppercase tracking-wider">
                          <Package size={12} /> Fotos del Ingreso
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {fotos.map((foto: string, i: number) => (
                            <a key={i} href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/${foto}`} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                              <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/${foto}`} alt="Ingreso" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  }
                } catch (e) {
                  console.error("Error parsing fotos", e);
                }
                return null;
              })()}

              {/* Financial Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--card)]/80 border border-[var(--border)] rounded-xl p-4">
                  <label className="block text-[10px] font-mono text-[var(--text3)] mb-2 uppercase tracking-wider">Costo de Repuesto ($)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                    <input 
                      type="number" 
                      className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text)] font-mono outline-none focus:border-[var(--accent)]"
                      value={editData.costo_repuesto}
                      onChange={(e) => { setEditData({ ...editData, costo_repuesto: parseFloat(e.target.value) || 0 }); setIsEditing(true); }}
                    />
                  </div>
                </div>
                <div className="bg-[var(--card)]/80 border border-[var(--border)] rounded-xl p-4">
                  <label className="block text-[10px] font-mono text-[var(--text3)] mb-2 uppercase tracking-wider">Precio Final al Cliente ($)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent)]" />
                    <input 
                      type="number" 
                      className="w-full bg-[var(--bg)] border border-[var(--border2)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--accent)] font-bold font-mono outline-none focus:border-[var(--accent)]"
                      value={editData.precio}
                      onChange={(e) => { setEditData({ ...editData, precio: parseFloat(e.target.value) || 0 }); setIsEditing(true); }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border)] bg-[var(--card)]/50 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] font-mono text-[var(--text3)] uppercase">Ganancia Proyectada</span>
             <span className="text-sm font-bold text-[var(--accent)]">${(editData.precio - editData.costo_repuesto).toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={copyTrackingLink}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                 copying 
                   ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' 
                   : 'bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)]'
               }`}
             >
               {copying ? <CheckCircle2 size={14} /> : <Link2 size={14} />}
               {copying ? 'Copiado!' : 'Link Cliente'}
             </button>
             <button 
               onClick={() => sendWhatsApp('receipt')}
               className="bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1ebe57] transition-all flex items-center gap-2"
             >
               <Share2 size={14} />
               Enviar Recibo
             </button>
             {editData.estado === 'listo' && (
               <button 
                 onClick={() => sendWhatsApp('ready')}
                 className="bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1ebe57] transition-all flex items-center gap-2"
               >
                 <MessageCircle size={14} />
                 Notificar Listo
               </button>
             )}
          </div>
          <div className="flex gap-3 relative">
             <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-[var(--text2)] hover:text-[var(--text)] transition-colors">
               Cancelar
             </button>
             <button 
               onClick={handleSave}
               disabled={saving || !isAdmin}
               className="bg-[var(--accent)] text-[var(--bg)] px-8 py-2 rounded-lg text-xs font-bold hover:bg-[#00ffca] transition-all shadow-lg flex items-center gap-2"
             >
               {saving ? <div className="w-4 h-4 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
               Guardar Cambios
             </button>
             {!isAdmin && isEditing && (
               <div className="absolute inset-0 bg-[var(--bg)]/10 backdrop-blur-[1px] flex items-center justify-center rounded-xl cursor-not-allowed" title="No tienes permisos para guardar">
                  <span className="bg-[var(--card)] px-3 py-1 rounded-full text-[10px] font-mono text-[var(--text3)] border border-[var(--border)]">ADMIN REQUERIDO</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
