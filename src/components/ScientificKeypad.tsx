import React from 'react';
import { AngleMode } from '../types';
import { soundEngine } from '../utils/audio';

interface ScientificKeypadProps {
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onScientificAction: (action: string) => void;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  angleMode,
  onToggleAngleMode,
  onScientificAction,
}) => {
  const handlePress = (action: string) => {
    soundEngine.playOperatorClick();
    onScientificAction(action);
  };

  return (
    <div className="w-full grid grid-cols-5 gap-2 px-4 py-2 border-t border-b border-neutral-900 bg-[#0a0a0a]/90 select-none animate-in fade-in duration-150">
      {/* Row 1 */}
      <button
        onClick={() => {
          soundEngine.playActionClick();
          onToggleAngleMode();
        }}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-neutral-800 text-[11px] font-semibold tracking-wider text-red-400 active:scale-95 transition-all flex items-center justify-center shadow-sm"
        title="Alternar Graus/Radianos"
      >
        {angleMode}
      </button>

      <button
        onClick={() => handlePress('sin(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        sin
      </button>

      <button
        onClick={() => handlePress('cos(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        cos
      </button>

      <button
        onClick={() => handlePress('tan(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        tan
      </button>

      <button
        onClick={() => handlePress('π')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-sm font-serif active:scale-95 transition-all border border-neutral-800/80"
      >
        π
      </button>

      {/* Row 2 */}
      <button
        onClick={() => handlePress('√(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-sm font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        √
      </button>

      <button
        onClick={() => handlePress('^2')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        x²
      </button>

      <button
        onClick={() => handlePress('^')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        xʸ
      </button>

      <button
        onClick={() => handlePress('(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-sm font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        (
      </button>

      <button
        onClick={() => handlePress(')')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-sm font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        )
      </button>

      {/* Row 3 */}
      <button
        onClick={() => handlePress('ln(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        ln
      </button>

      <button
        onClick={() => handlePress('log(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        log
      </button>

      <button
        onClick={() => handlePress('e')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-sm font-serif italic active:scale-95 transition-all border border-neutral-800/80"
      >
        e
      </button>

      <button
        onClick={() => handlePress('1/(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        1/x
      </button>

      <button
        onClick={() => handlePress('abs(')}
        className="h-10 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 hover:text-white text-xs font-medium active:scale-95 transition-all border border-neutral-800/80"
      >
        |x|
      </button>
    </div>
  );
};
