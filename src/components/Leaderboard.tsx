
import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '@/integrations/supabase/client';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardItem {
  username: string;
  score: number;
}

interface LeaderboardProps {
  currentUsername?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUsername }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const data = await getLeaderboard();
      // Convert data to match LeaderboardItem interface
      if (data && Array.isArray(data)) {
        setLeaderboardData(data as LeaderboardItem[]);
      }
      setLoading(false);
    }
    
    fetchLeaderboard();
    
    // Refresh leaderboard periodically
    const intervalId = setInterval(fetchLeaderboard, 60000); // every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy size={18} className="text-yellow-500" />;
      case 1:
        return <Medal size={18} className="text-gray-400" />;
      case 2:
        return <Award size={18} className="text-amber-700" />;
      default:
        return <span className="w-5 text-center text-xs text-gray-500">{index + 1}</span>;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="glass rounded-xl p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-3 w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center py-2 space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-xl p-4 backdrop-blur-sm bg-white/80 border border-white/60 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Trophy size={18} className="mr-2 text-yellow-500" /> 
          Leaderboard
        </h3>
        
        {leaderboardData.length === 0 ? (
          <p className="text-center py-4 text-gray-500 text-sm">
            No scores recorded yet. Be the first one!
          </p>
        ) : (
          <div className="space-y-1">
            {leaderboardData.map((item, index) => (
              <div 
                key={index}
                className={`flex items-center py-2 px-3 rounded-lg ${
                  currentUsername === item.username 
                    ? 'bg-indigo-100/50 border border-indigo-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-6 flex justify-center mr-3">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 font-medium truncate">
                  {item.username}
                  {currentUsername === item.username && (
                    <span className="ml-1 text-xs text-indigo-600">(You)</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-semibold">{item.score}</span>
                  <span className="text-xs text-gray-500 ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
