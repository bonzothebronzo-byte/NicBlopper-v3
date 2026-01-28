import React from 'react';
import { LogEntry } from '../types';

interface LogTableProps {
  logs: LogEntry[];
  onDelete: (id: string) => void;
}

const LogTable: React.FC<LogTableProps> = ({ logs, onDelete }) => {
  const displayLogs = logs.slice(0, 20);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden mb-6">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200">Today's Log (Last 20)</h3>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800 text-slate-400 font-medium">
          <tr>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Dose</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {displayLogs.map(log => (
            <tr key={log.id} className="hover:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-300">{formatTime(log.timestamp)}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold 
                  ${log.amount === 1 ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-800/50' : 
                    log.amount === 2 ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-800/50' : 
                    'bg-purple-900/40 text-purple-300 border border-purple-800/50'}`}>
                  {log.amount} mg
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => onDelete(log.id)}
                  className="text-red-400 hover:text-red-300 font-medium text-xs px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {displayLogs.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-slate-500 italic">
                No doses logged today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;