import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, X, Clock, ArrowDownLeft, Copy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onCopy: (text: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  onCopy,
}) => {
  if (!isOpen) return null;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm h-full bg-[#0d0d0d] border-l border-neutral-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E50914]" />
            <h2 className="text-sm font-semibold tracking-wider uppercase text-white">Histórico de Cálculos</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => {
                  soundEngine.playActionClick();
                  onClearHistory();
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 active:scale-95 transition-all text-xs flex items-center gap-1"
                title="Limpar Histórico"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            )}
            <button
              onClick={() => {
                soundEngine.playActionClick();
                onClose();
              }}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 active:scale-95 transition-all"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of past calculations */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <Clock className="w-10 h-10 mb-3 text-neutral-700 stroke-[1.5]" />
              <p className="text-sm font-medium text-neutral-400">Nenhum cálculo registrado</p>
              <p className="text-xs text-neutral-600 mt-1">Os cálculos realizados serão salvos aqui automaticamente.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group p-3.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-neutral-800/60 hover:border-red-900/40 transition-all cursor-pointer relative"
                onClick={() => {
                  soundEngine.playActionClick();
                  onSelectHistory(item);
                }}
              >
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span className="font-mono">{formatTime(item.timestamp)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playNumberClick();
                        onCopy(item.result);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                      title="Copiar resultado"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playActionClick();
                        onSelectHistory(item);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-[#E50914] hover:bg-neutral-800"
                      title="Usar cálculo"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right text-xs text-neutral-400 font-mono tracking-wide truncate">
                  {item.expression} =
                </div>
                <div className="text-right text-xl font-bold font-mono text-[#E50914] tracking-tight glow-red-text">
                  {item.result}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-900 text-center text-[11px] text-neutral-600">
          Toque em qualquer cálculo para carregá-lo no visor
        </div>
      </div>
    </div>
  );
};
