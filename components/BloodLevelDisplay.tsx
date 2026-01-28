import React, { useEffect, useState } from 'react';
import { LogEntry } from '../types';
import { PHARMA, KA, KE } from '../constants';

interface BloodLevelDisplayProps {
  logs: LogEntry[];
}

const BloodLevelDisplay: React.FC<BloodLevelDisplayProps> = ({ logs }) => {
  const [level, setLevel] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      let totalConcentration = 0; // in ng/mL

      logs.forEach(log => {
        const timeDiffMinutes = (now - log.timestamp) / 60000;
        
        // Ignore future logs or logs older than 24 hours (negligible)
        if (timeDiffMinutes < 0 || timeDiffMinutes > 1440) return;

        // Bateman function for 1-compartment model with first-order absorption
        // C(t) = (Dose * F / Vd) * (ka / (ka - ke)) * (exp(-ke*t) - exp(-ka*t))
        
        // Dose in ng (mg * 1,000,000)
        const D = log.amount * 1_000_000;
        // Volume in mL (L * 1000)
        const V = PHARMA.VOLUME_DISTRIBUTION_L * 1000;
        
        const term1 = (D * PHARMA.BIOAVAILABILITY) / V;
        const term2 = KA / (KA - KE);
        const term3 = Math.exp(-KE * timeDiffMinutes) - Math.exp(-KA * timeDiffMinutes);

        const concentration = term1 * term2 * term3;
        
        if (concentration > 0) {
            totalConcentration += concentration;
        }
      });

      setLevel(totalConcentration);
    };

    calculate();
    // Update every second for "Real Time" feel
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 mb-6 text-center">
      <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">
        Est. Saturation
      </h2>
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-4xl font-extrabold text-slate-100">
          {level.toFixed(1)}
        </span>
        <span className="text-slate-500 font-medium">ng/mL</span>
      </div>
      <p className="text-xs text-slate-500 mt-2 italic">
        *Approximation based on 65kg male model.
      </p>
    </div>
  );
};

export default BloodLevelDisplay;