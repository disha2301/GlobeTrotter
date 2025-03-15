import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import QuizCard from "@/components/QuizCard";
import ProgressBar from "@/components/ProgressBar";
import UserProfileForm from "@/components/UserProfileForm";
import ChallengeModal from "@/components/ChallengeModal";
import Leaderboard from "@/components/Leaderboard";
import ResetGameButton from "@/components/ResetGameButton";
import {
  getUserProfile,
  updateUserScore,
  resetAllProfiles,
} from "@/integrations/supabase/client";
import { Users, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [username, setUsername] = useState<string | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [searchParams] = useSearchParams();
  const [challengerInfo, setChallengerInfo] = useState<{
    name: string;
    score: number;
  } | null>(null);
  const [isGameOwner, setIsGameOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const challenger = searchParams.get("challenger");
    const challengerScore = searchParams.get("score");

    if (challenger && challengerScore) {
      setChallengerInfo({
        name: challenger,
        score: parseInt(challengerScore, 10) || 0,
      });

      setIsGameOwner(false);
    } else {
      setIsGameOwner(true);
    }
  }, [searchParams]);

  const handleScoreUpdate = async (correct: boolean) => {
    if (correct) {
      const newCorrectScore = score.correct + 1;
      setScore((prev) => ({ ...prev, correct: newCorrectScore }));

      if (username) {
        await updateUserScore(username, newCorrectScore);
      }
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleProfileCreated = (newUsername: string) => {
    setUsername(newUsername);

    const storedScore = localStorage.getItem(
      `globetrotter_score_${newUsername}`
    );
    if (storedScore) {
      try {
        const parsedScore = JSON.parse(storedScore);
        setScore(parsedScore);
      } catch (e) {
        console.error("Failed to parse stored score");
      }
    }
  };

  const handleGameReset = async () => {
    setScore({ correct: 0, incorrect: 0 });

    if (username) {
      localStorage.removeItem(`globetrotter_score_${username}`);
    }

    setUsername(null);
    localStorage.removeItem("globetrotter_username");
    await resetAllProfiles();
    toast({
      title: "Game Reset",
      description: "All profiles and scores have been reset.",
    });

    setShowChallengeModal(false);
    setShowLeaderboard(false);
  };
  useEffect(() => {
    if (username) {
      localStorage.setItem(
        `globetrotter_score_${username}`,
        JSON.stringify(score)
      );
    }
  }, [score, username]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("globetrotter_username");

    if (savedUsername) {
      getUserProfile(savedUsername).then((profile) => {
        if (profile) {
          setUsername(savedUsername);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem("globetrotter_username", username);
    }
  }, [username]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#030015]">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <Header />

        {username ? (
          <>
            <div className="w-full flex flex-col items-center mt-8 sm:mt-12">
              {}
              <div className="w-full flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-full border border-indigo-200">
                    <span className="text-sm font-medium text-indigo-700">
                      Player name: {username}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white/80 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                  >
                    <Users size={16} />
                    <span className="hidden sm:inline">Leaderboard</span>
                  </button>

                  <button
                    onClick={() => setShowChallengeModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-colors"
                  >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Challenge a Friend</span>
                  </button>

                  {}
                  {isGameOwner && (
                    <ResetGameButton
                      username={username}
                      onReset={handleGameReset}
                    />
                  )}
                </div>
              </div>

              {challengerInfo && (
                <div className="w-full mb-6 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-lg p-3 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-amber-800">
                      <strong>{challengerInfo.name}</strong> has challenged you!
                      Their score: <strong>{challengerInfo.score}</strong>{" "}
                      correct answers.
                    </p>
                  </div>
                </div>
              )}
              {showLeaderboard && (
                <div className="w-full mb-6 animate-fade-in">
                  <Leaderboard currentUsername={username} />
                </div>
              )}

              <ProgressBar
                correct={score.correct}
                incorrect={score.incorrect}
              />
              <QuizCard onScoreUpdate={handleScoreUpdate} />
            </div>

            <ChallengeModal
              username={username}
              score={score}
              isOpen={showChallengeModal}
              onClose={() => setShowChallengeModal(false)}
            />
          </>
        ) : (
          <div className="w-full flex flex-col items-center mt-8 sm:mt-12 animate-fade-in">
            <UserProfileForm onProfileCreated={handleProfileCreated} />

            {}
            {challengerInfo && (
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-lg text-center max-w-md">
                <p className="text-amber-800">
                  <strong>{challengerInfo.name}</strong> has challenged you!
                  Their score: <strong>{challengerInfo.score}</strong> correct
                  answers.
                </p>
                <p className="text-sm mt-2 text-amber-700">
                  Create a profile to accept the challenge!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
