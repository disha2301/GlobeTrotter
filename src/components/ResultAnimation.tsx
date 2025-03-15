import React, { useEffect, useState } from "react";
import { Frown, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface ResultAnimationProps {
  isCorrect: boolean;
  funFact: string;
}

const ResultAnimation: React.FC<ResultAnimationProps> = ({ isCorrect, funFact }) => {
  const [shake, setShake] = useState(false);
  const [showRedOverlay, setShowRedOverlay] = useState(false);

  useEffect(() => {
    if (isCorrect) {
      // 🎉 Fire confetti on correct answer
      const fireConfetti = () => {
        confetti({ particleCount: 150, spread: 180, origin: { y: 0.6, x: 0.5 }, zIndex: 9999 });
        setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.5 }, zIndex: 9999 }), 200);
        setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.5 }, zIndex: 9999 }), 400);
        setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { x: 0.5, y: 0 }, zIndex: 9999 }), 600);
      };
      fireConfetti();
      setTimeout(fireConfetti, 800);
    } else {
      
      setShake(true);
      setShowRedOverlay(true);
      setTimeout(() => setShake(false), 600); 
      setTimeout(() => setShowRedOverlay(false), 400); 
    }
  }, [isCorrect]);

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
      transition={{ duration: 0.6 }}
      className="w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* if the answer is incorrect */}
      <AnimatePresence>
        {showRedOverlay && (
          <motion.div
            className="fixed inset-0 bg-red-500 opacity-30 pointer-events-none"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* if the answer is correct */}
      {isCorrect ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="text-green-500 opacity-30"
            style={{ fontSize: "15rem" }}
          >
            <PartyPopper strokeWidth={1} />
          </motion.div>
        </div>
      ) : (
        /*  Incorrect Answer Animation */
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1.1, rotate: 10 }}
            transition={{ yoyo: Infinity, duration: 1.2 }}
            className="text-red-500 opacity-50"
            style={{ fontSize: "15rem" }}
          >
          </motion.div>
        </div>
      )}

      {/*  Result Card */}
      <div className="glass rounded-2xl p-6 shadow-lg animate-scale-in bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md border border-white/60 relative z-40">
        <div className="flex items-center mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mr-3
              ${isCorrect ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600"}`}
          >
            {isCorrect ? <PartyPopper size={24} className="animate-pulse-scale" /> : <Frown size={24} className="animate-pulse-scale" />}
          </div>
          <h3 className="text-lg font-medium">{isCorrect ? "Correct!" : "Incorrect!"}</h3>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-sm">
          <h4 className="text-sm text-gray-500 mb-1 font-medium">{isCorrect ? "Fun Fact:" : "Trivia:"}</h4>
          <p className="text-sm">{funFact}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultAnimation;
