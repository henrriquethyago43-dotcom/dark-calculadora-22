import React from 'react';
import { Delete } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface KeypadProps {
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onPercentage: () => void;
  onToggleSign: () => void;
  onDecimal: () => void;
  onEquals: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onNumber,
  onOperator,
  onClear,
  onBackspace,
  onPercentage,
  onToggleSign,
  onDecimal,
  onEquals,
}) => {
  return (
    <div className="w-full grid grid-cols-4 gap-3 p-4 select-none">
      {/* ROW 1: AC, ⌫, %, ÷ */}
      <button
        onClick={() => {
          soundEngine.playActionClick();
          onClear();
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#1a1a1a] hover:bg-[#252525] border border-neutral-800 text-red-500 hover:text-red-400 font-bold text-lg md:text-xl active:scale-95 transition-all flex items-center justify-center shadow-md active:bg-red-950/40"
        title="Limpar tudo (AC)"
      >
        AC
      </button>

      <button
        onClick={() => {
          soundEngine.playActionClick();
          onBackspace();
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#141414] hover:bg-[#202020] border border-neutral-800/80 text-neutral-300 hover:text-white font-medium text-lg active:scale-95 transition-all flex items-center justify-center shadow-md"
        title="Apagar último número (Backspace)"
      >
        <Delete className="w-6 h-6 stroke-[2]" />
      </button>

      <button
        onClick={() => {
          soundEngine.playOperatorClick();
          onPercentage();
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#141414] hover:bg-[#202020] border border-neutral-800/80 text-[#E50914] font-semibold text-xl active:scale-95 transition-all flex items-center justify-center shadow-md"
        title="Porcentagem (%)"
      >
        %
      </button>

      <button
        onClick={() => {
          soundEngine.playOperatorClick();
          onOperator('÷');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#E50914]/15 hover:bg-[#E50914]/25 border border-[#E50914]/40 text-[#E50914] hover:text-white font-bold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-md hover:border-[#E50914]"
        title="Divisão (÷)"
      >
        ÷
      </button>

      {/* ROW 2: 7, 8, 9, × */}
      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('7');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        7
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('8');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        8
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('9');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        9
      </button>

      <button
        onClick={() => {
          soundEngine.playOperatorClick();
          onOperator('×');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#E50914]/15 hover:bg-[#E50914]/25 border border-[#E50914]/40 text-[#E50914] hover:text-white font-bold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-md hover:border-[#E50914]"
        title="Multiplicação (×)"
      >
        ×
      </button>

      {/* ROW 3: 4, 5, 6, − */}
      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('4');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        4
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('5');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        5
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('6');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        6
      </button>

      <button
        onClick={() => {
          soundEngine.playOperatorClick();
          onOperator('−');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#E50914]/15 hover:bg-[#E50914]/25 border border-[#E50914]/40 text-[#E50914] hover:text-white font-bold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-md hover:border-[#E50914]"
        title="Subtração (−)"
      >
        −
      </button>

      {/* ROW 4: 1, 2, 3, + */}
      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('1');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        1
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('2');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        2
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('3');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        3
      </button>

      <button
        onClick={() => {
          soundEngine.playOperatorClick();
          onOperator('+');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#E50914]/15 hover:bg-[#E50914]/25 border border-[#E50914]/40 text-[#E50914] hover:text-white font-bold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-md hover:border-[#E50914]"
        title="Adição (+)"
      >
        +
      </button>

      {/* ROW 5: +/−, 0, ., = */}
      <button
        onClick={() => {
          soundEngine.playActionClick();
          onToggleSign();
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#141414] hover:bg-[#202020] border border-neutral-800/80 text-neutral-300 hover:text-white font-semibold text-xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
        title="Positivo/Negativo (+/−)"
      >
        +/−
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onNumber('0');
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-semibold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
      >
        0
      </button>

      <button
        onClick={() => {
          soundEngine.playNumberClick();
          onDecimal();
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#111111] hover:bg-[#1c1c1c] border border-neutral-800/60 text-white font-bold text-2xl active:scale-95 transition-all flex items-center justify-center shadow-sm"
        title="Vírgula / Ponto decimal"
      >
        .
      </button>

      <button
        onClick={() => {
          soundEngine.playEqualsClick();
          onEquals();
        }}
        className="h-16 md:h-18 rounded-2xl bg-[#E50914] hover:bg-[#ff1e27] text-white font-bold text-3xl active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-red-950/60 glow-red-md border border-red-500/50"
        title="Resultado (=)"
      >
        =
      </button>
    </div>
  );
};
