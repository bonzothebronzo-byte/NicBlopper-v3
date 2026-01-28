import React, { useState } from 'react';

interface DoseSelectorProps {
  onAddDose: (amount: number) => void;
}

const DoseSelector: React.FC<DoseSelectorProps> = ({ onAddDose }) => {
  const [flashingDose, setFlashingDose] = useState<number | null>(null);

  const handleDoseClick = (amount: number) => {
    setFlashingDose(amount);
    onAddDose(amount);
    
    // Hold the active state for 200ms to ensure it's visible on tap
    setTimeout(() => {
      setFlashingDose(null);
    }, 200);
  };

  const getButtonClasses = (amount: number) => {
    const isFlashing = flashingDose === amount;
    const baseClasses = "h-24 transition-all duration-100 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white disabled:cursor-not-allowed disabled:transform-none touch-manipulation";
    
    let colorClasses = "";
    if (amount === 1) {
      // Cyan
      colorClasses = isFlashing 
        ? "bg-cyan-800 scale-95" 
        : "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-800 active:scale-95";
    } else if (amount === 2) {
      // Indigo
      colorClasses = isFlashing 
        ? "bg-indigo-800 scale-95" 
        : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-800 active:scale-95";
    } else {
      // Purple
      colorClasses = isFlashing 
        ? "bg-purple-800 scale-95" 
        : "bg-purple-600 hover:bg-purple-500 active:bg-purple-800 active:scale-95";
    }

    return `${baseClasses} ${colorClasses}`;
  };

  return (
    <div className="mb-6 relative">
      <div className="grid grid-cols-3 gap-4 transition-opacity duration-300 opacity-100">
        <button
          onClick={() => handleDoseClick(1)}
          className={getButtonClasses(1)}
        >
          <span className="text-3xl font-bold">1<span className="text-sm font-normal">mg</span></span>
        </button>
        <button
          onClick={() => handleDoseClick(2)}
          className={getButtonClasses(2)}
        >
          <span className="text-3xl font-bold">2<span className="text-sm font-normal">mg</span></span>
        </button>
        <button
          onClick={() => handleDoseClick(4)}
          className={getButtonClasses(4)}
        >
          <span className="text-3xl font-bold">4<span className="text-sm font-normal">mg</span></span>
        </button>
      </div>
    </div>
  );
};

export default DoseSelector;