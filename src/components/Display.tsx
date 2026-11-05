import React, { useRef, useEffect } from 'react';
import { Copy, History, Volume2, VolumeX, Sparkles, Smartphone } from 'lucide-react';
import { AngleMode } from '../types';
import { soundEngine } from '../utils/audio';

interface DisplayProps {
  expression: string;
  result: string;
  previewResult: string | null;
  errorMessage: string | null;
  isScientificOpen: boolean;
  angleMode: AngleMode;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onToggleScientific: () => void;
  onOpenHistory: () => void;
  onCopyResult: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  previewResult,
  errorMessage,
  isScientificOpen,
  angleMode,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onToggleScientific,
  onOpenHistory,
  onCopyResult,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const exprRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end of expression and result when typing
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollLeft = resultRef.current.scrollWidth;
    }
  }, [result]);

  useEffect(() => {
    if (exprRef.current) {
      exprRef.current.scrollLeft = exprRef.current.scrollWidth;
    }
  }, [expression]);

  // Dynamic text size based on character count
  const getTextSizeClass = (text: string) => {
    const len = text.length;
    if (len <= 7) return 'text-5xl md:text-6xl';
    if (len <= 10) return 'text-4xl md:text-5xl';
    if (len <= 14) return 'text-3xl md:text-4xl';
    return 'text-2xl md:text-3xl';
  };

  return (
    <div className="w-full flex flex-col justify-end px-5 py-3 select-none flex-1 min-h-[170px] max-h-[260px]">
      {/* Top Bar with Brand & Utility Actions */}
      <div className="flex items-center justify-between pb-3 mb-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E50914] glow-red-sm" />
          <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">
            DARK CALCULADORA
          </h1>
          {isScientificOpen && (
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-red-950/50 border border-red-900/50 text-red-400">
              {angleMode}
            </span>
          )}
        </div>

        {/* Quick actions: Sound, Haptics, Scientific, History */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundEngine.playNumberClick();
              onToggleSound();
            }}
            className={`p-2 rounded-lg transition-colors active:scale-95 ${
              soundEnabled
                ? 'text-neutral-300 hover:text-white bg-neutral-900/60'
                : 'text-neutral-600 hover:text-neutral-400 bg-neutral-900/30'
            }`}
            title={soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-red-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              soundEngine.playNumberClick();
              onToggleHaptics();
            }}
            className={`p-2 rounded-lg transition-colors active:scale-95 ${
              hapticsEnabled
                ? 'text-neutral-300 hover:text-white bg-neutral-900/60'
                : 'text-neutral-600 hover:text-neutral-400 bg-neutral-900/30'
            }`}
            title={hapticsEnabled ? 'Vibração Ativada' : 'Vibração Desativada'}
          >
            <Smartphone className={`w-4 h-4 ${hapticsEnabled ? 'text-red-500' : 'text-neutral-600'}`} />
          </button>

          <button
            onClick={() => {
              soundEngine.playActionClick();
              onToggleScientific();
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-95 flex items-center gap-1 border ${
              isScientificOpen
                ? 'bg-red-950/60 border-red-600/60 text-red-400 glow-red-sm'
                : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Funções Científicas"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ADV</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playActionClick();
              onOpenHistory();
            }}
            className="p-2 rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 active:scale-95 transition-all"
            title="Histórico de Cálculos"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expression Display (History / Calculation in Progress) */}
      <div 
        ref={exprRef}
        className="w-full overflow-x-auto text-right text-sm md:text-base font-mono text-neutral-400 tracking-wider h-6 whitespace-nowrap mb-1 scroll-smooth"
      >
        {expression ? (
          <span>{expression}</span>
        ) : (
          <span className="text-neutral-700 opacity-50">&nbsp;</span>
        )}
      </div>

      {/* Main Result or Active Digits */}
      <div className="relative group flex items-baseline justify-end gap-2">
        <div
          ref={resultRef}
          onClick={() => {
            soundEngine.playNumberClick();
            onCopyResult();
          }}
          className={`w-full overflow-x-auto text-right font-mono font-bold tracking-tight text-white whitespace-nowrap cursor-pointer transition-all active:opacity-80 py-1 ${getTextSizeClass(
            errorMessage || result
          )}`}
          title="Toque para copiar"
        >
          {errorMessage ? (
            <span className="text-red-500 glow-red-text text-xl md:text-2xl font-sans font-medium">
              {errorMessage}
            </span>
          ) : (
            <span className="selection:bg-red-900 selection:text-white">
              {result}
            </span>
          )}
        </div>

        {/* Copy Icon on hover or mobile tap */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playNumberClick();
            onCopyResult();
          }}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800/60 transition-opacity opacity-0 group-hover:opacity-100 shrink-0"
          title="Copiar resultado"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {/* Live Preview of calculation in subtle red */}
      <div className="h-5 text-right font-mono text-xs md:text-sm font-semibold text-[#E50914] tracking-wide mt-1">
        {previewResult && !errorMessage && previewResult !== result ? (
          <span className="animate-in fade-in duration-150">
            = {previewResult}
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </div>
  );
};
