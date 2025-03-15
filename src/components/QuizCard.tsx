import { useToast } from "@/hooks/use-toast"
import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import OptionButton from './OptionButton';
import ResultAnimation from './ResultAnimation';
import { Destination, getRandomDestination, getRandomOptions } from '@/services/destinationService';

interface QuizCardProps {
  onScoreUpdate: (correct: boolean) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ onScoreUpdate }) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [funFact, setFunFact] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [displayedClues, setDisplayedClues] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Initialize or reset quiz
  const initQuiz = async () => {
    setLoading(true);
    setSelectedOption('');
    setIsCorrect(null);
    setShowResult(false);
    
    try {
      const newDestination = await getRandomDestination();
      
      if (newDestination) {
        setDestination(newDestination);
        
        // Get random options
        const newOptions = await getRandomOptions(newDestination.city);
        setOptions(newOptions);
        
        // Randomly decide to show 1 or 2 clues
        const clueCount = Math.random() > 0.5 ? 2 : 1;
        const shuffledClues = [...newDestination.clues].sort(() => 0.5 - Math.random());
        setDisplayedClues(shuffledClues.slice(0, clueCount));
      } else {
        toast({
          title: "Error",
          description: "Could not load destination data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to initialize quiz:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    initQuiz();
  }, []);
  
  const handleOptionClick = (option: string) => {
    
    if (!showResult) {
      setSelectedOption(option);
    }
  };
  
  const handleSubmit = () => {
    if (!selectedOption) {
      toast({
        title: "Selection Required",
        description: "Please select an answer option.",
        variant: "default",
      });
      return;
    }
    
    
    const correct = selectedOption === destination?.city;
    setIsCorrect(correct);
    
    
    const facts = correct ? destination?.fun_facts : destination?.trivia;
    const randomFact = facts?.[Math.floor(Math.random() * (facts?.length || 1))] || '';
    setFunFact(randomFact);
    
    
    onScoreUpdate(correct);
    
    
    setTimeout(() => {
      setShowResult(true);
    }, 300);
  };
  
  if (loading) {
    return (
      <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border border-white/60 p-6 animate-pulse">
        <div className="h-4 bg-gray-200/70 rounded w-3/4 mb-4"></div>
        <div className="h-16 bg-gray-200/70 rounded mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200/70 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md glass rounded-2xl shadow-sm p-6 bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-md animate-fade-in border border-white/60">
      {showResult ? (
        <div className="animate-fade-in">
          <ResultAnimation isCorrect={isCorrect || false} funFact={funFact} />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={initQuiz}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium transition-all hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isCorrect ? (
                <>
                  Next  <ArrowRight size={16} className="ml-2" />
                </>
              ) : (
                <>
                  Play Again <RefreshCw size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-1">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Where is this?
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/60 shadow-sm">
            {displayedClues.map((clue, index) => (
              <p key={index} className="text-lg leading-relaxed mb-2 last:mb-0">{clue}</p>
            ))}
          </div>
          
          <div className="space-y-3 mb-4">
            {options.map((option) => (
              <OptionButton
                key={option}
                option={option}
                onClick={() => handleOptionClick(option)}
                isSelected={selectedOption === option}
                disabled={showResult}
              />
            ))}
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Answer
          </button>
        </>
      )}
    </div>
  );
};

export default QuizCard;
