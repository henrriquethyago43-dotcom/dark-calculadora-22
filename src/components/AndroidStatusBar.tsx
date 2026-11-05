import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-medium text-neutral-400 select-none tracking-tight">
      {/* Clock */}
      <span className="font-mono text-[13px] text-neutral-200">{time || '12:00'}</span>

      {/* Camera punch-hole simulation */}
      <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-900 shadow-inner" aria-hidden="true" />

      {/* System Status Icons */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-neutral-400">5G</span>
        <Signal className="w-3.5 h-3.5 text-neutral-300" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5 text-neutral-300" strokeWidth={2.5} />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-neutral-400">100%</span>
          <BatteryMedium className="w-4 h-4 text-neutral-300 rotate-90" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};
