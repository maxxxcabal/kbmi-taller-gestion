"use client";

import React, { useEffect, useState } from 'react';
import { Printer, Share2, CheckCircle2, Smartphone, ClipboardList, Download, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';

export default function ReceiptPage() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTicketMode, setIsTicketMode] = useState(true); // Default to Ticket for mobile-first printing
  const [isTagMode, setIsTagMode] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  const handlePrint = () => window.print();

  const handleDownloadImage = async () => {
    const element = document.getElementById('printable-content');
    if (!element) return;
    
    setExporting(true);
    try {
      // Ensure the background is white for thermal printing
      const dataUrl = await toPng(element, { 
        backgroundColor: '#fff',
        pixelRatio: 2, // Higher quality
      });
      
      const link = document.createElement('a');
      link.download = `ticket-${order.codigo}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Error al generar la imagen del ticket');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center p-20 font-mono text-sm text-[var(--text3)]">Cargando comprobante...</div>;
  if (!order || !config) return <div className="flex items-center justify-center p-20 font-mono text-sm text-[var(--red)]">Error al cargar datos.</div>;

  return (
    <div className={`${(isTicketMode || isTagMode) ? 'max-w-[320px]' : 'max-w-[800px]'} mx-auto p-4 sm:p-4 animate-in fade-in duration-500 print:p-0 print:max-w-none`}>
      
      {/* Action Bar (Hidden on print) */}
      <div className="flex flex-col gap-3 mb-6 print:hidden">
        <div className="flex gap-2">
            <button 
              onClick={() => { setIsTicketMode(true); setIsTagMode(false); }} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${
                  isTicketMode && !isTagMode
                  ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]' 
                  : 'bg-[var(--card)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              <Smartphone size={16} /> Ticket Cte.
            </button>
            <button 
              onClick={() => { setIsTagMode(true); setIsTicketMode(false); }} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border ${
                  isTagMode 
                  ? 'bg-[var(--orange)] text-white border-[var(--orange)]' 
                  : 'bg-[var(--card)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              <ClipboardList size={16} /> Ticket Téc.
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-[var(--text3)]"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <button 
                onClick={handleDownloadImage} 
                disabled={exporting}
                className="flex items-center justify-center gap-2 bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)] py-3 rounded-xl text-xs font-bold hover:opacity-90"
            >
                {exporting ? <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" /> : <Download size={16} />}
                {exporting ? 'Generando...' : 'Guardar Imagen'}
            </button>
            <button 
                onClick={handlePrint} 
                className="flex items-center justify-center gap-2 bg-[var(--card)] border border-[var(--border)] py-3 rounded-xl text-xs font-bold"
            >
                <Printer size={16} /> Imprimir PDF
            </button>
        </div>

        <button 
          onClick={() => {
            const text = config.mensaje_whatsapp_recepcion
              .replace('{cliente}', order.cliente?.nombre || '')
              .replace('{equipo}', `${order.equipo?.marca} ${order.equipo?.modelo}`)
              .replace('{link}', window.location.href);
            window.open(`https://wa.me/${order.cliente?.telefono || ''}?text=${encodeURIComponent(text)}`, '_blank');
          }} 
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl text-xs font-bold shadow-lg"
        >
          <Share2 size={16} /> Enviar por WhatsApp
        </button>
      </div>

      <div id="printable-content" className="bg-white">
        {isTagMode ? (
          /* Mini Technician Tag - Optimized for Thermal */
          <div className="bg-white text-black p-2 border-2 border-dashed border-black">
            <div className="text-center border-b-2 border-black pb-1 mb-2">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-black">ORDEN DE TRABAJO</h2>
              <div className="text-5xl font-black tracking-tighter text-black leading-none">#{order.codigo}</div>
              <p className="text-[10px] text-black font-black mt-1 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>

            <div className="space-y-2">
               <section>
                 <h3 className="text-[8px] font-black text-black uppercase mb-0.5 underline">CLIENTE:</h3>
                 <div className="text-sm font-black text-black uppercase leading-none">{order.cliente?.nombre}</div>
               </section>

               <section>
                 <h3 className="text-[8px] font-black text-black uppercase mb-0.5 underline">EQUIPO:</h3>
                 <div className="text-xs font-black text-black leading-none uppercase">
                   {order.equipo?.marca} {order.equipo?.modelo}
                 </div>
                 {order.equipo?.imei && <p className="text-[10px] text-black font-black mt-0.5">IMEI: {order.equipo.imei}</p>}
               </section>

               <section className="bg-gray-100 p-1.5 rounded border-2 border-black">
                 <h3 className="text-[8px] font-black text-black uppercase mb-0.5">FALLA:</h3>
                 <div className="text-[11px] text-black font-black leading-tight uppercase italic font-serif">"{order.problema}"</div>
               </section>

               {order.equipo?.pin_patron && (
                 <section className="pt-1 border-t-2 border-black">
                   <h3 className="text-[8px] font-black text-black uppercase mb-1">DESBLOQUEO:</h3>
                   <div className="flex justify-center bg-white p-1 border-2 border-black rounded inline-block">
                      {order.equipo.pin_patron.startsWith('data:image') ? (
                        <img src={order.equipo.pin_patron} alt="Patrón" className="h-24 w-auto grayscale contrast-200 brightness-50" />
                      ) : (
                        <span className="text-lg font-black tracking-widest">{order.equipo.pin_patron}</span>
                      )}
                   </div>
                 </section>
               )}
            </div>

            <div className="mt-4 pt-2 border-t-2 border-black text-center">
              <div className="text-[10px] font-black text-black uppercase">{config.nombre_taller}</div>
            </div>
          </div>
        ) : (
          /* Full Receipt Card - Optimized for Thermal */
          <div className={`bg-white text-black border-2 border-black relative ${isTicketMode ? 'p-2' : 'p-6'}`}>
            
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-1 mb-3 border-b-2 border-black pb-2">
              <h1 className="text-2xl font-black tracking-tighter text-black uppercase leading-none">{config.nombre_taller}</h1>
              <p className="text-[10px] font-black text-black uppercase tracking-widest">SERVICIO TÉCNICO</p>
              <div className="mt-1 text-[10px] text-black font-black space-y-0.5">
                <p>📍 {config.direccion}</p>
                <p>📞 {config.telefono}</p>
              </div>
              <div className="mt-2 bg-black text-white px-6 py-1 rounded inline-block font-black text-xl">
                ORDEN #{order.codigo}
              </div>
              <p className="text-[10px] text-black font-black mt-1 uppercase italic font-serif">
                {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>

            <div className="space-y-3 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <section>
                  <h3 className="text-[8px] font-black text-black uppercase mb-0.5 underline">CLIENTE:</h3>
                  <div className="text-[11px] font-black text-black uppercase leading-none">{order.cliente?.nombre}</div>
                </section>
                <section>
                  <h3 className="text-[8px] font-black text-black uppercase mb-0.5 underline">EQUIPO:</h3>
                  <div className="text-[11px] font-black text-black leading-none uppercase">{order.equipo?.marca} {order.equipo?.modelo}</div>
                </section>
              </div>

              <section>
                <h3 className="text-[8px] font-black text-black uppercase mb-0.5">FALLA REPORTADA:</h3>
                <div className="text-[11px] text-black font-black leading-tight border-2 border-black p-2 rounded bg-gray-50 uppercase italic font-serif">
                  "{order.problema}"
                </div>
              </section>

              <div className="grid grid-cols-2 gap-2 items-end">
                <section>
                  <h3 className="text-[8px] font-black text-black uppercase mb-1">ESTADO:</h3>
                  <div className="flex flex-wrap gap-1 text-[9px] font-black">
                     {Object.entries(order.checklist || {}).map(([k, v]: [string, any]) => (
                       <div key={k} className={`uppercase px-1 border border-black ${v ? 'bg-black text-white' : 'text-gray-300 line-through opacity-30'}`}>
                         {k}
                       </div>
                     ))}
                   </div>
                </section>
                <section className="bg-black text-white p-2 rounded text-center">
                  <h3 className="text-[8px] font-black text-white uppercase mb-0.5">TOTAL ESTIMADO:</h3>
                  <div className="text-2xl font-black">${order.precio_estimado || '---'}</div>
                </section>
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-t-2 border-dashed border-black pt-3 mt-1 text-center">
              <h3 className="text-[9px] font-black text-black uppercase mb-2 underline">FIRMA CONFORMIDAD:</h3>
              <div className="flex justify-center mb-2">
                {order.signature_data ? (
                  <div className="bg-white p-1 border-2 border-black">
                    <img src={order.signature_data} alt="Firma" className="h-16 w-auto object-contain contrast-200 grayscale brightness-50" />
                  </div>
                ) : (
                  <div className="h-16 w-48 border-b-2 border-black" />
                )}
              </div>
              <p className="text-[9px] text-black font-black text-center uppercase italic font-serif leading-tight">
                {config.mensaje_recibo}
              </p>
            </div>

            <div className="mt-4 text-center text-[9px] text-black font-black uppercase tracking-tighter border-t-2 border-black pt-1">
              *** DOCUMENTO NO VALIDO COMO FACTURA ***
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
