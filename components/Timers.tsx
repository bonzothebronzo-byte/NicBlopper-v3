import React, { useEffect, useState } from 'react';
import { LogEntry } from '../types';
import { PHARMA, UI_CONSTANTS } from '../constants';

interface TimersProps {
  logs: LogEntry[];
}

const Timers: React.FC<TimersProps> = ({ logs }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toDateString();
  const todaysLogs = logs.filter(l => new Date(l.timestamp).toDateString() === todayStr);
  const totalToday = todaysLogs.reduce((sum, log) => sum + log.amount, 0);
  const remainingDaily = PHARMA.MAX_DAILY_DOSE_MG - totalToday;

  // Timers rely on the most recent log
  const lastLog = logs.length > 0 ? logs[0] : null;

  const getMinutesRemaining = (durationMinutes: number) => {
    if (!lastLog) return null;
    const elapsed = (now - lastLog.timestamp) / 60000;
    const remaining = durationMinutes - elapsed;
    return remaining;
  };

  const spitRemaining = getMinutesRemaining(UI_CONSTANTS.SPIT_OUT_TIME_MIN);
  const nextDoseRemaining = getMinutesRemaining(UI_CONSTANTS.NEXT_DOSE_TIME_MIN);

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return "0:00";
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Daily Allowance */}
      <div className="bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-800 flex justify-between items-center">
        <span className="font-medium text-slate-300">Daily Remaining</span>
        <div className="text-right">
             <span className={`text-2xl font-bold ${remainingDaily <= 0 ? 'text-red-400' : 'text-slate-100'}`}>
            {remainingDaily}
            </span>
            <span className="text-sm text-slate-500"> / {PHARMA.MAX_DAILY_DOSE_MG} mg</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Spit Out Timer */}
        <div className="bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-800">
           <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Gum Depleted ({UI_CONSTANTS.SPIT_OUT_TIME_MIN}m)</h3>
           {lastLog ? (
             <div className={`text-2xl font-mono font-bold ${(spitRemaining || 0) <= 0 ? 'text-green-400' : 'text-slate-100'}`}>
               {spitRemaining && spitRemaining > 0 ? formatTime(spitRemaining) : "READY"}
             </div>
           ) : (
             <div className="text-xl text-slate-700">--:--</div>
           )}
        </div>

        {/* Next Dose Timer */}
        <div className="bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-800">
           <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Cooldown Done ({UI_CONSTANTS.NEXT_DOSE_TIME_MIN}m)</h3>
           {lastLog ? (
             <div className={`text-2xl font-mono font-bold ${(nextDoseRemaining || 0) <= 0 ? 'text-green-400' : 'text-slate-100'}`}>
               {nextDoseRemaining && nextDoseRemaining > 0 ? formatTime(nextDoseRemaining) : "READY"}
             </div>
           ) : (
             <div className="text-xl text-slate-700">--:--</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Timers;