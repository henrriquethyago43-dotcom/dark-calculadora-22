import React, { useState, useEffect, useCallback } from 'react';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Toast } from './components/Toast';
import { MathEngine } from './utils/mathEngine';
import { soundEngine } from './utils/audio';
import { HistoryItem, AngleMode } from './types';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  // Calculator core state
  const [expression, setExpression] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings and mode state
  const [isScientificOpen, setIsScientificOpen] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Layout mode: Phone Frame on desktop vs Fullscreen
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Load preferences and history from localStorage
  useEffect(() => {
    try {
      setSoundEnabled(soundEngine.isSoundEnabled());
      setHapticsEnabled(soundEngine.isHapticsEnabled());

      const savedHistory = localStorage.getItem('dark_calc_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      const savedAngle = localStorage.getItem('dark_calc_angle');
      if (savedAngle === 'DEG' || savedAngle === 'RAD') {
        setAngleMode(savedAngle);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save history to localStorage
  const saveHistoryItem = useCallback((expr: string, res: string) => {
    if (!expr || !res || res === 'Erro') return;
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      expression: expr,
      result: res,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      try {
        localStorage.setItem('dark_calc_history', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Calculate live preview as user inputs tokens
  useEffect(() => {
    if (hasEvaluated || errorMessage) {
      setPreviewResult(null);
      return;
    }

    // Build the full test expression
    let fullExpr = expression;
    if (currentValue !== '0' || !expression) {
      if (fullExpr.endsWith(' ') || !fullExpr) {
        fullExpr += currentValue;
      } else {
        fullExpr += currentValue;
      }
    }

    if (!fullExpr || fullExpr === '0') {
      setPreviewResult(null);
      return;
    }

    // Test if has at least one operator
    const hasOp = /[+\-×÷^%]/.test(fullExpr);
    if (!hasOp) {
      setPreviewResult(null);
      return;
    }

    const { result, error } = MathEngine.evaluate(fullExpr, angleMode);
    if (!error && result !== 'Erro' && result !== currentValue) {
      setPreviewResult(result);
    } else {
      setPreviewResult(null);
    }
  }, [expression, currentValue, hasEvaluated, errorMessage, angleMode]);

  // Input a numeric digit
  const handleNumber = useCallback((digit: string) => {
    setErrorMessage(null);

    if (hasEvaluated) {
      // Start fresh calculation after equals
      setCurrentValue(digit);
      setExpression('');
      setHasEvaluated(false);
      return;
    }

    setCurrentValue((prev) => {
      if (prev === '0') {
        return digit;
      }
      // Limit to 16 digits to avoid numeric overflow
      if (prev.replace(/[^0-9]/g, '').length >= 16) {
        return prev;
      }
      return prev + digit;
    });
  }, [hasEvaluated]);

  // Input an operator (+, −, ×, ÷)
  const handleOperator = useCallback((op: string) => {
    setErrorMessage(null);

    if (hasEvaluated) {
      // Continue from the previous result
      setExpression(`${currentValue} ${op} `);
      setCurrentValue('0');
      setHasEvaluated(false);
      return;
    }

    // If current value is entered, push it to expression
    if (expression === '' && currentValue === '0') {
      // Start from 0 with operator
      setExpression(`0 ${op} `);
      return;
    }

    // If expression ends with an operator and current value is '0', replace operator
    if (expression.endsWith(' ') && currentValue === '0') {
      const trimmed = expression.trim();
      const lastOpIndex = trimmed.lastIndexOf(' ');
      const newBase = lastOpIndex !== -1 ? trimmed.substring(0, lastOpIndex + 1) : '';
      setExpression(`${newBase}${op} `);
      return;
    }

    setExpression((prev) => `${prev}${currentValue} ${op} `);
    setCurrentValue('0');
  }, [hasEvaluated, currentValue, expression]);

  // All Clear (AC)
  const handleClear = useCallback(() => {
    setExpression('');
    setCurrentValue('0');
    setPreviewResult(null);
    setErrorMessage(null);
    setHasEvaluated(false);
  }, []);

  // Backspace (⌫)
  const handleBackspace = useCallback(() => {
    setErrorMessage(null);

    if (hasEvaluated) {
      handleClear();
      return;
    }

    setCurrentValue((prev) => {
      if (prev.length > 1) {
        // If it was negative single digit like -5, reset to 0
        if (prev.length === 2 && prev.startsWith('-')) {
          return '0';
        }
        return prev.slice(0, -1);
      }
      // If current is '0' and we have an expression, roll back into expression
      if (prev === '0' && expression.length > 0) {
        const trimmed = expression.trimEnd();
        // Remove trailing operator and space
        const lastSpace = trimmed.lastIndexOf(' ');
        if (lastSpace !== -1) {
          const removed = trimmed.substring(lastSpace + 1);
          setExpression(trimmed.substring(0, lastSpace + 1));
          return removed || '0';
        } else {
          setExpression('');
          return trimmed || '0';
        }
      }
      return '0';
    });
  }, [hasEvaluated, handleClear, expression]);

  // Percentage (%)
  const handlePercentage = useCallback(() => {
    setErrorMessage(null);

    if (hasEvaluated) {
      const num = parseFloat(currentValue);
      if (!isNaN(num)) {
        const res = MathEngine.formatNumber(num / 100);
        setCurrentValue(res);
        setExpression(`${currentValue}% =`);
      }
      return;
    }

    // Append % to current value or expression
    setCurrentValue((prev) => {
      const num = parseFloat(prev);
      if (isNaN(num)) return '0';
      // In standalone context, divide by 100
      if (!expression) {
        return MathEngine.formatNumber(num / 100);
      }
      // With active expression like "200 + ", evaluate percentage of 200
      return `${prev}%`;
    });
  }, [hasEvaluated, currentValue, expression]);

  // Decimal point (.)
  const handleDecimal = useCallback(() => {
    setErrorMessage(null);

    if (hasEvaluated) {
      setCurrentValue('0.');
      setExpression('');
      setHasEvaluated(false);
      return;
    }

    setCurrentValue((prev) => {
      // Prevent multiple dots in the current active number
      if (prev.includes('.')) {
        return prev;
      }
      return prev + '.';
    });
  }, [hasEvaluated]);

  // Toggle positive/negative sign (+/−)
  const handleToggleSign = useCallback(() => {
    setErrorMessage(null);

    if (currentValue === '0' || currentValue === '') {
      return;
    }

    setCurrentValue((prev) => {
      if (prev.startsWith('-')) {
        return prev.substring(1);
      } else {
        return `-${prev}`;
      }
    });
  }, [currentValue]);

  // Equals (=)
  const handleEquals = useCallback(() => {
    let fullExpr = expression;

    if (hasEvaluated) {
      // Repeated equals or nothing to evaluate
      return;
    }

    if (currentValue !== '0' || !fullExpr) {
      fullExpr = `${fullExpr}${currentValue}`;
    }

    if (!fullExpr || fullExpr.trim() === '') {
      return;
    }

    const { result, error } = MathEngine.evaluate(fullExpr, angleMode);

    if (error) {
      setErrorMessage(error);
      return;
    }

    saveHistoryItem(fullExpr, result);
    setExpression(`${fullExpr} =`);
    setCurrentValue(result);
    setPreviewResult(null);
    setHasEvaluated(true);
  }, [expression, currentValue, hasEvaluated, angleMode, saveHistoryItem]);

  // Scientific functions handling
  const handleScientificAction = useCallback((action: string) => {
    setErrorMessage(null);

    if (action === '^2') {
      // Square
      setCurrentValue((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num)) return '0';
        return MathEngine.formatNumber(num * num);
      });
      return;
    }

    if (action === '1/(') {
      // Reciprocal
      setCurrentValue((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num) || num === 0) {
          setErrorMessage('Não é possível dividir por zero');
          return '0';
        }
        return MathEngine.formatNumber(1 / num);
      });
      return;
    }

    if (action === 'abs(') {
      // Absolute value
      setCurrentValue((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num)) return '0';
        return MathEngine.formatNumber(Math.abs(num));
      });
      return;
    }

    // For functions like sin(, cos(, tan(, √, ln(, log(, π, e, (, )
    if (action === 'π' || action === 'e') {
      setCurrentValue(action);
      return;
    }

    if (action.endsWith('(')) {
      setExpression((prev) => `${prev}${action}`);
      setCurrentValue('0');
      return;
    }

    if (action === '^') {
      setExpression((prev) => `${prev}${currentValue} ^ `);
      setCurrentValue('0');
      return;
    }

    if (action === ')') {
      setExpression((prev) => `${prev}${currentValue})`);
      setCurrentValue('0');
      return;
    }
  }, [currentValue]);

  // Copy result to clipboard
  const handleCopyResult = useCallback(() => {
    const textToCopy = errorMessage || currentValue;
    if (!textToCopy) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('Copiado para a área de transferência!'))
        .catch(() => showToast('Não foi possível copiar', 'error'));
    } else {
      // Fallback
      showToast('Copiado para a área de transferência!');
    }
  }, [currentValue, errorMessage, showToast]);

  // Select item from history
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setCurrentValue(item.result);
    setExpression(`${item.expression} =`);
    setHasEvaluated(true);
    setErrorMessage(null);
    setIsHistoryOpen(false);
    showToast(`Carregado: ${item.result}`);
  }, [showToast]);

  // Clear history
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('dark_calc_history');
    } catch {
      // Ignore
    }
    showToast('Histórico apagado com sucesso');
  }, [showToast]);

  // Angle mode toggle (DEG / RAD)
  const handleToggleAngleMode = useCallback(() => {
    setAngleMode((prev) => {
      const next = prev === 'DEG' ? 'RAD' : 'DEG';
      try {
        localStorage.setItem('dark_calc_angle', next);
      } catch {
        // Ignore
      }
      showToast(`Modo angular: ${next}`);
      return next;
    });
  }, [showToast]);

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setSoundEnabled(next);
    showToast(next ? 'Sons ativados' : 'Sons desativados');
  }, [soundEnabled, showToast]);

  // Haptics toggle
  const handleToggleHaptics = useCallback(() => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    soundEngine.setHapticsEnabled(next);
    showToast(next ? 'Vibração ativada' : 'Vibração desativada');
  }, [hapticsEnabled, showToast]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input (not present here, but safe practice)
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        soundEngine.playNumberClick();
        handleNumber(e.key);
      } else if (e.key === '+') {
        soundEngine.playOperatorClick();
        handleOperator('+');
      } else if (e.key === '-') {
        soundEngine.playOperatorClick();
        handleOperator('−');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        soundEngine.playOperatorClick();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        soundEngine.playOperatorClick();
        handleOperator('÷');
      } else if (e.key === '.' || e.key === ',') {
        soundEngine.playNumberClick();
        handleDecimal();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        soundEngine.playEqualsClick();
        handleEquals();
      } else if (e.key === 'Backspace') {
        soundEngine.playActionClick();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        soundEngine.playActionClick();
        handleClear();
      } else if (e.key === '%') {
        soundEngine.playOperatorClick();
        handlePercentage();
      } else if (e.key === '(' || e.key === ')') {
        soundEngine.playOperatorClick();
        handleScientificAction(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleNumber,
    handleOperator,
    handleDecimal,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
    handleScientificAction,
  ]);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden relative selection:bg-red-900 selection:text-white">
      {/* Toast Notification */}
      <Toast message={toastMessage} type={toastType} />

      {/* Background ambient red glow accents */}
      <div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#E50914]/8 blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#E50914]/8 blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Desktop Mode Switcher (Android Device Frame vs Full Viewport) */}
      <div className="hidden md:flex items-center gap-3 absolute top-5 right-6 z-30">
        <button
          onClick={() => setIsFrameMode(!isFrameMode)}
          className="px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-800/80 backdrop-blur-md flex items-center gap-2 transition-all shadow-lg active:scale-95"
          title="Alternar entre modo smartphone Android e tela cheia"
        >
          {isFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Tela Expandida</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Moldura Android</span>
            </>
          )}
        </button>
      </div>

      {/* Main Calculator Container */}
      <main
        className={`w-full flex flex-col justify-between transition-all duration-300 relative bg-[#080808] border border-neutral-900 shadow-2xl ${
          isFrameMode
            ? 'md:max-w-[430px] md:h-[880px] md:rounded-[44px] md:border-neutral-800/80 md:shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(229,9,20,0.15)] md:overflow-hidden md:my-auto'
            : 'max-w-xl h-screen md:h-[860px] md:rounded-3xl'
        }`}
      >
        {/* Android Status Bar (Always present on mobile frame) */}
        <div className="shrink-0 pt-1">
          <AndroidStatusBar />
        </div>

        {/* Display Area */}
        <Display
          expression={expression}
          result={MathEngine.formatDisplayValue(currentValue)}
          previewResult={previewResult ? MathEngine.formatDisplayValue(previewResult) : null}
          errorMessage={errorMessage}
          isScientificOpen={isScientificOpen}
          angleMode={angleMode}
          soundEnabled={soundEnabled}
          hapticsEnabled={hapticsEnabled}
          onToggleSound={handleToggleSound}
          onToggleHaptics={handleToggleHaptics}
          onToggleScientific={() => setIsScientificOpen(!isScientificOpen)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onCopyResult={handleCopyResult}
        />

        {/* Scientific Functions Keypad (Collapsible) */}
        {isScientificOpen && (
          <div className="shrink-0">
            <ScientificKeypad
              angleMode={angleMode}
              onToggleAngleMode={handleToggleAngleMode}
              onScientificAction={handleScientificAction}
            />
          </div>
        )}

        {/* Main 4x5 Keypad */}
        <div className="shrink-0 pb-6 md:pb-5">
          <Keypad
            onNumber={handleNumber}
            onOperator={handleOperator}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onPercentage={handlePercentage}
            onToggleSign={handleToggleSign}
            onDecimal={handleDecimal}
            onEquals={handleEquals}
          />

          {/* Android Navigation Bar Indicator */}
          <div className="w-32 h-1 bg-neutral-800/80 rounded-full mx-auto mt-2" aria-hidden="true" />
        </div>

        {/* History Slide-over Drawer */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          onCopy={(text) => {
            handleCopyResult();
            showToast(`Copiado: ${text}`);
          }}
        />
      </main>

      {/* Desktop subtle footer */}
      <footer className="hidden md:flex items-center gap-4 text-xs text-neutral-600 mt-4 tracking-wider select-none font-medium">
        <span>DARK CALCULADORA</span>
        <span aria-hidden="true">·</span>
        <span>Atalhos de teclado suportados (0-9, +, -, *, /, Enter, Esc)</span>
        <span aria-hidden="true">·</span>
        <span>Modo Offline</span>
      </footer>
    </div>
  );
}
