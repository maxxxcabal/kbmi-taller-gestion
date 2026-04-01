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
      const data = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(data);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full h-40 bg-white border border-[var(--border2)] rounded-xl relative overflow-hidden">
        <SignatureCanvas 
          ref={sigCanvas}
          canvasProps={{
            className: "w-full h-full cursor-crosshair",
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
