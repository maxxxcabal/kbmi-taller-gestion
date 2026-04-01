"use client";

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onClear?: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClear }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    if (onClear) onClear();
  };

  const save = () => {
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        onSave('');
      } else {
        const data = sigCanvas.current.getTrimmedCanvas().toDataURL('image/jpeg', 0.6);
        onSave(data);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="w-full h-full min-h-[140px] bg-white border border-[var(--border2)] rounded-xl relative overflow-hidden">
        <SignatureCanvas 
          ref={sigCanvas}
          backgroundColor="white"
          penColor="black"
          canvasProps={{
            className: "w-full h-full cursor-crosshair touch-none",
            style: { width: '100%', height: '100%' }
          }}
          onEnd={save}
        />
      </div>
      <div className="flex justify-end">
        <button 
          type="button"
          onClick={clear}
          className="text-[10px] font-mono text-[var(--text3)] uppercase hover:text-[var(--red)] transition-colors"
        >
          Borrar firma
        </button>
      </div>
    </div>
  );
};
