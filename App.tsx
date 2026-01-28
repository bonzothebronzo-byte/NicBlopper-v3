import React, { useEffect, useState } from 'react';
import { getLogs, saveLogs } from './services/storageService';
import { LogEntry } from './types';
import DoseSelector from './components/DoseSelector';
import BloodLevelDisplay from './components/BloodLevelDisplay';
import Timers from './components/Timers';
import LogTable from './components/LogTable';
import WeeklyStats from './components/WeeklyStats';

const App: React.FC = () => {
  // Initialize state with logs from localStorage
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Load logs
    const data = getLogs();
    data.sort((a, b) => b.timestamp - a.timestamp);
    setLogs(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveLogs(logs);
    }
  }, [logs, loaded]);

  const generateId = () => {
    // Fallback for environments where crypto.randomUUID is not available (e.g. non-secure contexts)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleAddDose = (amount: number) => {
    const newEntry: LogEntry = {
      id: generateId(),
      amount,
      timestamp: Date.now(),
    };
    // Prepend to list (newest first)
    setLogs(prev => [newEntry, ...prev]);
  };

  const handleDeleteDose = (id: string) => {
    // Removed window.confirm to ensure deletion works reliably across all devices/webviews
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-black text-slate-100 tracking-tight text-center">
            Nico<span className="text-cyan-500">Blopper</span> — Nicotine Gum Tracker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        
        {/* 1. Big Buttons */}
        <DoseSelector 
          onAddDose={handleAddDose} 
        />

        {/* 2. Real Time Estimate */}
        <BloodLevelDisplay logs={logs} />

        {/* 3. Timers & Limits */}
        <Timers logs={logs} />

        {/* 4. Daily Log */}
        <LogTable logs={logs} onDelete={handleDeleteDose} />

        {/* 5. Weekly Stats */}
        <WeeklyStats logs={logs} />

        {/* Disclaimer Footer */}
        <footer className="mt-8 mb-4 border-t border-slate-900 pt-6">
            <p className="text-[10px] text-slate-600 text-center leading-relaxed font-medium mb-4">
            NicoBlopper is a tracking tool for educational and informational purposes only. It uses a standard mathematical formula (Bateman function) to simulate theoretical nicotine levels. It is not a medical device and does not measure actual physiological data. Do not use this tool to make medical decisions. Consult a healthcare professional for advice on quitting smoking.
            </p>
            <p className="text-[10px] text-slate-700 text-center font-medium opacity-60">
              &copy; Damp Doily
            </p>
        </footer>

      </main>
    </div>
  );
};

export default App;