import { useToast } from "@/hooks/use-toast"
import React, { useState } from 'react';
import { X, Share2, CheckCheck, Copy } from 'lucide-react';

interface ChallengeModalProps {
  username: string;
  score: { correct: number; incorrect: number };
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ username, score, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  if (!isOpen) return null;
  
  const inviteLink = `${window.location.origin}?challenger=${encodeURIComponent(username)}&score=${score.correct}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Challenge link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    }
  };
  
  const handleWhatsAppShare = () => {
    const message = `Challenge from ${username}! Can you beat my score of ${score.correct} correct answers in The Globetrotter Challenge? Try it now: ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-auto">
        <div className="glass rounded-2xl p-6 shadow-xl bg-gradient-to-br from-indigo-50/95 to-purple-50/95 backdrop-blur-md border border-white/60 animate-scale-in">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 text-indigo-700 rounded-full mb-2">
              <Share2 size={20} />
            </div>
            <h2 className="text-xl font-semibold">Challenge a Friend</h2>
            <p className="text-sm text-gray-600 mt-1">
              Send this challenge to see if your friends can beat your score!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-xl text-white text-center mb-4">
            <p className="font-medium text-lg">{username}</p>
            <p className="text-sm opacity-90">has scored</p>
            <div className="flex justify-center items-center space-x-1 text-2xl font-bold my-1">
              <span>{score.correct}</span>
              <span className="text-sm opacity-75">correct answers</span>
            </div>
            <p className="text-sm italic">Can you beat that?</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none bg-white/80"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-r-lg border border-l-0 border-gray-300 hover:bg-indigo-200 transition-colors"
              >
                {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-lg font-medium transition-all hover:bg-green-600"
            >
              <span>Share via WhatsApp</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:opacity-90"
            >
              {copied ? 'Copied!' : 'Copy Challenge Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;