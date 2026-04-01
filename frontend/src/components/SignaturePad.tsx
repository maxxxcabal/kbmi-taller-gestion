"use client";

import React, { useRef, memo, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onClear?: () => void;
  height?: string;
}

export const SignaturePad = memo(({ onSave, onClear, height = "140px" }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Resize handler to ensure canvas doesn't clear OR misbehave on rotation/resize
  useEffect(() => {
    const handleResize = () => {
      // SignatureCanvas doesn't like being resized without a redraw
      // but for now we just want it to fill the container correctly
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clear = () => {
    sigCanvas.current?.clear();
    if (onClear) onClear();
  };

  const save = () => {
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        onSave('');
      } else {
        // Reduced quality to 0.4 to ensure fetch success on slow mobile networks
        const data = sigCanvas.current.getTrimmedCanvas().toDataURL('image/jpeg', 0.4);
        onSave(data);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div 
        className="w-full bg-white border border-[var(--border2)] rounded-xl relative overflow-hidden"
        style={{ height }}
      >
        <SignatureCanvas 
          ref={sigCanvas}
          backgroundColor="white"
          penColor="black"
          velocityFilterWeight={0.7}
          canvasProps={{
            className: "w-full h-full cursor-crosshair touch-none",
            style: { width: '100%', height: '100%', display: 'block' }
          }}
          onEnd={save}
        />
      </div>
      <div className="flex justify-end">
        <button 
          type="button"
          onClick={clear}
          className="text-[10px] font-mono text-[var(--text3)] uppercase hover:text-[var(--red)] transition-colors px-2 py-1"
        >
          Borrar / Limpiar
        </button>
      </div>
    </div>
  );
});

SignaturePad.displayName = 'SignaturePad';
