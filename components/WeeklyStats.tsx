import React, { useMemo } from 'react';
import { LogEntry } from '../types';
import { PHARMA } from '../constants';

interface WeeklyStatsProps {
  logs: LogEntry[];
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ logs }) => {
  const stats = useMemo(() => {
    // 1. Group by date string (YYYY-MM-DD)
    const dailyTotals: Record<string, number> = {};
    
    logs.forEach(log => {
      const dateKey = new Date(log.timestamp).toLocaleDateString(); // Local date string is fine for this scope
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + log.amount;
    });

    // 2. Extract last 7 unique days present in the logs
    // We sort keys descending (newest first)
    const sortedDates = Object.keys(dailyTotals).sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    });

    const recentDays = sortedDates.slice(0, 7);

    // 3. Calculate Average (only of days with data, as requested)
    const sum = recentDays.reduce((acc, date) => acc + dailyTotals[date], 0);
    const count = recentDays.length;
    const average = count > 0 ? sum / count : 0;

    return {
      average,
      days: recentDays.map(date => ({
        date,
        total: dailyTotals[date]
      }))
    };
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden mb-20">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200">7-Day Analysis</h3>
        <span className="text-xs bg-slate-700 border border-slate-600 px-2 py-1 rounded text-slate-300">
          Avg: {stats.average.toFixed(1)} mg
        </span>
      </div>
      <div className="divide-y divide-slate-800">
        {stats.days.map(day => {
           const isLower = day.total < stats.average;
           const isHigher = day.total > stats.average;
           
           return (
            <div key={day.date} className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-slate-400">{day.date}</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono font-bold ${
                    isLower ? 'text-green-400' : isHigher ? 'text-red-400' : 'text-slate-300'
                }`}>
                  {day.total} mg
                </span>
                {/* Visual Indicator */}
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isLower ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ width: `${Math.min(100, (day.total / PHARMA.MAX_DAILY_DOSE_MG) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
           );
        })}
        {stats.days.length === 0 && (
           <div className="px-4 py-6 text-center text-slate-500 italic text-sm">
             Not enough data for 7-day analysis.
           </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyStats;