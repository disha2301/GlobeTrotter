
import React from 'react';

interface ProgressBarProps {
  correct: number;
  incorrect: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ correct, incorrect }) => {
  const total = correct + incorrect || 1; // Avoid division by zero
  const correctPercentage = (correct / total) * 100;
  
  return (
    <div className="w-full max-w-md mb-6 p-4 glass rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-green-600 mr-2">Correct</span>
          <span className="text-sm px-2 py-0.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full font-medium">{correct}</span>
        </div>
        <div className="text-lg font-semibold">
          Score: {correct}/{total}
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-red-600 mr-2">Incorrect</span>
          <span className="text-sm px-2 py-0.5 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full font-medium">{incorrect}</span>
        </div>
      </div>
      
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${correctPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
