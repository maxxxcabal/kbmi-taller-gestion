"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, User, Smartphone, ClipboardList, PenTool, Camera, Trash2, DollarSign } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { SignaturePad } from './SignaturePad';
import { apiFetch, pingBackend, API_BASE_URL } from '@/lib/api';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);

  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    equipo_marca: '',
    equipo_modelo: '',
    equipo_imei: '',
    problema: '',
    checklist: {
      pantalla: true,
      tactil: true,
      carga: true,
      audio: true,
      botones: true
    },
    signature_data: '',
    fotos: '[]',
    equipo_pin: '',
    precio_estimado: 0,
    sena: 0
  });

  useEffect(() => {
    if (isOpen) {
      pingBackend(); // Wake up backend immediately when order started
      apiFetch('/config/').then(setConfig).catch(console.error);
    }
  }, [isOpen]);

  const handlePinSave = useCallback((data: string) => {
    setFormData(prev => ({ ...prev, equipo_pin: data }));
  }, []);

  const handleSignatureSave = useCallback((data: string) => {
    setFormData(prev => ({ ...prev, signature_data: data }));
  }, []);

  if (!isOpen) return null;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let finalFilenames = [];

      // 1. Subir fotos si hay
      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData();
        selectedFiles.forEach(file => uploadFormData.append('files', file));
        
        const uploadUrl = API_BASE_URL.endsWith('/') ? `${API_BASE_URL}uploads/` : `${API_BASE_URL}/uploads/`;
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          body: uploadFormData
        });
        
        if (!uploadRes.ok) throw new Error("Error al subir imágenes");
        const uploadData = await uploadRes.json();
        finalFilenames = uploadData.filenames;
      }

      // 2. Guardar orden con los nombres de archivo
      const orderPayload = {
        ...formData,
        fotos: JSON.stringify(finalFilenames)
      };

      const data = await apiFetch('/ordenes', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      console.log("Orden guardada:", data);
      onClose();
      setStep(1); 
      setSelectedFiles([]);
      setPreviews([]);
      setFormData({
        cliente_nombre: '',
        cliente_telefono: '',
        equipo_marca: '',
        equipo_modelo: '',
        equipo_imei: '',
        problema: '',
        checklist: {
          pantalla: true,
          tactil: true,
          carga: true,
          audio: true,
          botones: true
        },
        signature_data: '',
        fotos: '[]',
        equipo_pin: '',
        precio_estimado: 0,
        sena: 0
      });
      router.push(`/receipt?id=${data.id}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in transition-all p-4">
      <div className="bg-[var(--sidebar)] border border-[var(--border)] w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center text-[var(--accent)] font-bold">
               {step}
             </div>
             <div>
               <h3 className="text-sm font-extrabold text-[var(--text)]">Nueva Orden</h3>
               <p className="text-[10px] font-mono text-[var(--text3)] uppercase tracking-wider">Paso {step} de 5</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--card)] rounded-full text-[var(--text3)] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 min-h-[350px] overflow-y-auto flex-1">
          
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[11px] mb-2 uppercase tracking-wider">
                <User size={14} /> Información del Cliente
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase">Nombre Completo</label>
                <input 
                  type="text" 
                  className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
                  placeholder="Ej: Juan Pérez"
                  value={formData.cliente_nombre}
                  onChange={e => setFormData({...formData, cliente_nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase">WhatsApp / Teléfono</label>
                <input 
                  type="text" 
                  className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
                  placeholder="3772..."
                  value={formData.cliente_telefono}
                  onChange={e => setFormData({...formData, cliente_telefono: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[11px] mb-2 uppercase tracking-wider">
                <Smartphone size={14} /> Detalles del Equipo
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase">Marca</label>
                  <input 
                    type="text" 
                    className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
                    placeholder="Samsung"
                    value={formData.equipo_marca}
                    onChange={e => setFormData({...formData, equipo_marca: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase">Modelo</label>
                  <input 
                    type="text" 
                    className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
                    placeholder="A54"
                    value={formData.equipo_modelo}
                    onChange={e => setFormData({...formData, equipo_modelo: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase">IMEI / Serie (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors"
                  placeholder="Ej: 3567..."
                  value={formData.equipo_imei}
                  onChange={e => setFormData({...formData, equipo_imei: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase">Patrón / PIN Numérico</label>
                <input 
                  type="text" 
                  className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors mb-2"
                  placeholder="Ej: 1234 o Ninguno"
                  value={formData.equipo_pin.startsWith('data:image') ? '' : formData.equipo_pin}
                  onChange={e => setFormData({...formData, equipo_pin: e.target.value})}
                />
                <SignaturePad 
                   onSave={handlePinSave}
                   onClear={() => setFormData({ ...formData, equipo_pin: '' })}
                   height="120px"
                />
                <p className="text-[9px] text-[var(--text3)] mt-1.5 font-mono uppercase tracking-wider italic text-center">Dibuja el patrón o escribe el PIN arriba</p>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Falla / Problema</label>
                <textarea 
                  rows={2}
                  className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg px-3.5 py-2.5 text-xs text-[var(--text)] focus:border-[var(--accent)] outline-none transition-colors resize-none"
                  placeholder="Describe el problema del equipo..."
                  value={formData.problema}
                  onChange={e => setFormData({...formData, problema: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pb-4">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Presupuesto ($)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
                    <input 
                      type="number" 
                      className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[var(--text)] font-bold font-mono outline-none focus:border-[var(--accent)]"
                      placeholder="0.00"
                      value={formData.precio_estimado}
                      onChange={e => setFormData({...formData, precio_estimado: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text3)] mb-1.5 uppercase tracking-wider">Seña / Adelanto ($)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--orange)]" />
                    <input 
                      type="number" 
                      className="w-full bg-[var(--card)] border border-[var(--border2)] rounded-lg pl-9 pr-3 py-2.5 text-xs text-[var(--orange)] font-bold font-mono outline-none focus:border-[var(--orange)]"
                      placeholder="0.00"
                      value={formData.sena}
                      onChange={e => setFormData({...formData, sena: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[11px] mb-2 uppercase tracking-wider">
                <ClipboardList size={14} /> Checklist Inicial
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formData.checklist).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] cursor-pointer hover:border-[var(--accent)] transition-colors">
                    <input 
                      type="checkbox" 
                      className="accent-[var(--accent)]"
                      checked={(formData.checklist as any)[key]}
                      onChange={(e) => setFormData({
                        ...formData, 
                        checklist: { ...formData.checklist, [key]: e.target.checked }
                      })}
                    />
                    <span className="text-[11px] font-bold text-[var(--text)] uppercase">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[11px] mb-2 uppercase tracking-wider">
                <Camera size={14} /> Fotos del Equipo
              </div>
              
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--card)]/30 hover:bg-[var(--card)]/50 transition-colors cursor-pointer group"
                   onClick={() => fileInputRef.current?.click()}>
                <Camera size={24} className="text-[var(--text3)] group-hover:text-[var(--accent)] transition-colors mb-2" />
                <span className="text-[11px] font-mono text-[var(--text3)] uppercase">Subir o tomar fotos</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border2)] group">
                    <img src={src} alt={`preview-${index}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                      className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-[11px] mb-2 uppercase tracking-wider">
                <PenTool size={14} /> Firma de Conformidad
              </div>
              <SignaturePad 
                onSave={handleSignatureSave}
                onClear={() => setFormData(prev => ({ ...prev, signature_data: '' }))}
                height="160px"
              />
              <p className="text-[9px] text-[var(--text3)] leading-tight italic text-center">
                 Al firmar, el cliente acepta los términos y condiciones del servicio de {config?.nombre_taller || 'KBMI Reparaciones'}.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--border)] bg-[var(--card)]/50 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={prevStep} className="px-5 py-2 rounded-lg text-xs font-bold text-[var(--text2)] hover:text-[var(--text)] transition-colors">
              Atrás
            </button>
          ) : <div></div>}
          
          {step < 5 ? (
            <button onClick={nextStep} className="bg-[var(--accent)] text-[var(--bg)] px-6 py-2 rounded-lg text-xs font-bold hover:bg-[#00ffca] transition-all shadow-lg shadow-[var(--accent-dim)]">
              Siguiente
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !formData.signature_data}
              className={`bg-[var(--accent)] text-[var(--bg)] px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-[var(--accent-dim)] ${isSubmitting || !formData.signature_data ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00ffca]'}`}
            >
              {isSubmitting ? 'Guardando...' : 'Finalizar Registro'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
