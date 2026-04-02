"use client";

import React, { useEffect, useState } from 'react';
import { Printer, Share2, CheckCircle2, Smartphone, ClipboardList } from 'lucide-react';

export default function ReceiptPage() {
  const [id, setId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTicketMode, setIsTicketMode] = useState(false);
  const [isTagMode, setIsTagMode] = useState(false);

  useEffect(() => {
    const searchId = new URLSearchParams(window.location.search).get('id');
    setId(searchId);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const [orderRes, configRes] = await Promise.all([
          fetch(`${baseUrl}/ordenes/${id}`),
          fetch(`${baseUrl}/config`)
        ]);
        
        if (orderRes.ok) setOrder(await orderRes.json());
        if (configRes.ok) setConfig(await configRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center p-20 font-mono text-sm text-[var(--text3)]">Cargando comprobante...</div>;
  if (!order || !config) return <div className="flex items-center justify-center p-20 font-mono text-sm text-[var(--red)]">Error al cargar datos.</div>;

  const handlePrint = () => window.print();

  return (
    <div className={`${(isTicketMode || isTagMode) ? 'max-w-[320px]' : 'max-w-[800px]'} mx-auto p-4 sm:p-8 animate-in fade-in duration-500 print:p-0 print:max-w-none`}>
      
      {/* Action Bar (Hidden on print) */}
      <div className="flex flex-wrap gap-3 mb-6 print:hidden">
        <button 
          onClick={() => { setIsTicketMode(!isTicketMode); setIsTagMode(false); }} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${
            isTicketMode 
            ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' 
            : 'bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--accent)]'
          }`}
        >
          <Smartphone size={16} /> {isTicketMode ? 'Cerrar Ticket' : 'Ticket Cliente'}
        </button>
        <button 
          onClick={() => { setIsTagMode(!isTagMode); setIsTicketMode(false); }} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${
            isTagMode 
            ? 'bg-[var(--orange)] text-white border-[var(--orange)]' 
            : 'bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--orange)]'
          }`}
        >
          <ClipboardList size={16} /> {isTagMode ? 'Cerrar Etiqueta' : 'Etiqueta Técnico'}
        </button>
        <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-[var(--card)] border border-[var(--border)] py-3 rounded-xl text-xs font-bold hover:bg-[var(--bg3)] transition-colors">
          <Printer size={16} /> Imprimir
        </button>
        <button 
          onClick={() => {
            const text = config.mensaje_whatsapp_recepcion
              .replace('{cliente}', order.cliente?.nombre || '')
              .replace('{equipo}', `${order.equipo?.marca} ${order.equipo?.modelo}`)
              .replace('{link}', window.location.href);
            window.open(`https://wa.me/${order.cliente?.telefono || ''}?text=${encodeURIComponent(text)}`, '_blank');
          }} 
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <Share2 size={16} /> WhatsApp
        </button>
      </div>

      {isTagMode ? (
        /* Mini Technician Tag */
        <div className="bg-white text-black p-4 border-2 border-dashed border-gray-300 print:border-none print:p-2">
          <div className="text-center border-b border-gray-100 pb-3 mb-3">
            <h2 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Orden de Trabajo</h2>
            <div className="text-4xl font-black tracking-tighter text-gray-900">#{order.codigo}</div>
            <p className="text-[9px] text-gray-500 font-mono mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>

          <div className="space-y-4">
             <section>
               <h3 className="text-[8px] font-mono font-bold text-gray-400 uppercase mb-1">CLIENTE</h3>
               <div className="text-xs font-bold text-gray-900 truncate uppercase">{order.cliente?.nombre}</div>
             </section>

             <section>
               <h3 className="text-[8px] font-mono font-bold text-gray-400 uppercase mb-1">EQUIPO</h3>
               <div className="text-xs font-bold text-gray-900">{order.equipo?.marca} {order.equipo?.modelo}</div>
               {order.equipo?.imei && <p className="text-[8px] text-gray-500 font-mono">IMEI: ...{order.equipo.imei.slice(-6)}</p>}
             </section>

             <section className="bg-gray-50 p-2 rounded border border-gray-100">
               <h3 className="text-[8px] font-mono font-bold text-gray-400 uppercase mb-1">FALLA</h3>
               <div className="text-[10px] text-gray-800 leading-tight italic">"{order.problema}"</div>
             </section>

             {order.equipo?.pin_patron && (
               <section className="pt-2 border-t border-dashed border-gray-200">
                 <h3 className="text-[8px] font-mono font-bold text-gray-400 uppercase mb-2">DESBLOQUEO</h3>
                 <div className="flex justify-center bg-white p-1 border border-gray-100 rounded shadow-sm inline-block">
                    {order.equipo.pin_patron.startsWith('data:image') ? (
                      <img src={order.equipo.pin_patron} alt="Patrón" className="h-16 w-auto grayscale contrast-150" />
                    ) : (
                      <span className="text-sm font-mono font-bold">{order.equipo.pin_patron}</span>
                    )}
                 </div>
               </section>
             )}
          </div>

          <div className="mt-6 pt-3 border-t border-gray-100 text-center">
            <div className="text-[8px] font-mono text-gray-300 uppercase tracking-widest">{config.nombre_taller}</div>
          </div>
        </div>
      ) : (
        /* Full Receipt Card */
        <div className={`bg-white text-black rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-300 ${isTicketMode ? 'p-4 rounded-none shadow-none border-dashed border-gray-200' : 'p-8'} print:p-2 print:shadow-none print:border-none print:rounded-none`}>
          
          {/* Success Banner (Hidden on Ticket/Print) */}
          {!isTicketMode && (
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 print:hidden">
              <CheckCircle2 size={120} />
            </div>
          )}

          {/* Header */}
          <div className={`flex flex-col ${isTicketMode ? 'items-center text-center' : 'sm:flex-row justify-between items-start'} gap-4 mb-8 border-b border-gray-100 pb-6 print:items-center print:text-center`}>
            <div>
              <h1 className={`${isTicketMode ? 'text-xl' : 'text-3xl'} font-black tracking-tighter text-gray-900 mb-1`}>{config.nombre_taller}</h1>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Servicio Técnico</p>
              <div className="mt-3 space-y-0.5 text-[10px] text-gray-500 font-medium">
                <p>📍 {config.direccion}</p>
                <p>📞 {config.telefono}</p>
              </div>
            </div>
            <div className={`${isTicketMode ? 'text-center' : 'text-right'} print:text-center`}>
              <div className="inline-block bg-black text-white px-3 py-1 rounded-md font-mono text-sm font-bold mb-1">
                #{order.codigo}
              </div>
              <p className="text-[9px] text-gray-400 font-mono italic">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>

          {/* Details Content */}
          <div className={`grid grid-cols-1 ${isTicketMode ? '' : 'md:grid-cols-2'} gap-6 mb-8 print:grid-cols-1`}>
            
            <div className="space-y-5">
              <section>
                <h3 className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-[1px] mb-1.5">CLIENTE</h3>
                <div className="text-sm font-bold text-gray-800 uppercase">{order.cliente?.nombre}</div>
              </section>

              <section>
                <h3 className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-[1px] mb-1.5">DISPOSITIVO</h3>
                <div className="text-sm font-bold text-gray-800">{order.equipo?.marca} {order.equipo?.modelo}</div>
                <p className="text-[10px] text-gray-500 font-mono">IMEI: {order.equipo?.imei || 'N/A'}</p>
              </section>

              <section>
                <h3 className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-[1px] mb-1.5">FALLA</h3>
                <div className="text-[11px] text-gray-700 leading-tight bg-gray-50 p-3 rounded-lg border border-gray-100 italic print:bg-transparent print:p-0 print:border-none">
                  "{order.problema}"
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section>
                <h3 className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-[1px] mb-1.5">ESTADO INICIAL</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-bold">
                   {Object.entries(order.checklist || {}).map(([k, v]: [string, any]) => (
                     <div key={k} className="flex items-center gap-1.5">
                       <div className={`w-1 h-1 rounded-full ${v ? 'bg-black' : 'bg-gray-300'}`} />
                       <span className="uppercase text-gray-500 truncate">{k}</span>
                     </div>
                   ))}
                </div>
              </section>

              <section className={`${isTicketMode ? 'pt-2 border-t border-dashed border-gray-200' : ''}`}>
                <h3 className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-[1px] mb-1">TOTAL ESTIMADO</h3>
                <div className={`${isTicketMode ? 'text-2xl' : 'text-3xl'} font-black text-gray-900`}>
                  ${order.precio_estimado || 'Presp.'}
                </div>
              </section>
            </div>

          </div>

          {/* Signature Section */}
          <div className="border-t border-dashed border-gray-100 pt-6 mt-2">
            <div className="flex flex-col items-center">
              <h3 className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-[1px] mb-4">FIRMA CONFORMIDAD</h3>
              {order.signature_data ? (
                <img src={order.signature_data} alt="Firma" className="h-16 w-auto object-contain contrast-150 grayscale mx-auto" />
              ) : (
                <div className="h-12 w-40 border-b border-dashed border-gray-300" />
              )}
              <p className="text-[8px] text-gray-400 text-center mt-4 leading-normal px-2">
                {config.mensaje_recibo}
              </p>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center text-[8px] text-gray-300 font-mono uppercase tracking-widest">
            KBMI TALLER — COMPROBANTE DIGITAL
          </div>

        </div>
      )}
    </div>
  );
}
