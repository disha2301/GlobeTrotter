
import React from 'react';
import { cn } from '@/lib/utils';

interface OptionButtonProps {
  option: string;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null;
  isSelected?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ 
  option, 
  onClick, 
  disabled = false, 
  isCorrect = null,
  isSelected = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full py-4 px-6 rounded-xl border transition-all duration-300",
        "text-left font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
        "transform hover:translate-y-[-2px] active:translate-y-0",
        isSelected && isCorrect === null && "border-indigo-500 bg-indigo-50 text-indigo-700",
        isCorrect === true && "border-green-500 bg-gradient-to-r from-green-50 to-green-100 text-green-700",
        isCorrect === false && "border-red-500 bg-gradient-to-r from-red-50 to-red-100 text-red-700",
        !isSelected && isCorrect === null && "border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 backdrop-blur-sm",
        disabled && "opacity-70 cursor-not-allowed hover:translate-y-0",
        "animate-fade-in"
      )}
    >
      <span>{option}</span>
    </button>
  );
};

export default OptionButton;
