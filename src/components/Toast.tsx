import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md border ${
        type === 'error'
          ? 'bg-neutral-900/95 border-red-500/50 text-red-400 shadow-red-950/50'
          : 'bg-[#121212]/95 border-red-600/40 text-white shadow-black/80 glow-red-sm'
      }`}>
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
        )}
        <span className="text-xs font-medium tracking-wide">{message}</span>
      </div>
    </div>
  );
};
