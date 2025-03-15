import { useToast } from "@/hooks/use-toast"
import React, { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { resetAllProfiles } from '@/integrations/supabase/client';

interface ResetGameButtonProps {
  username: string;
  onReset: () => void;
}

const ResetGameButton: React.FC<ResetGameButtonProps> = ({ username, onReset }) => {
  const [open, setOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Call the resetAllProfiles function to delete all profiles from Supabase
      const success = await resetAllProfiles();
      
      if (success) {
        toast({
          title: "Game Reset",
          description: "All player profiles and scores have been reset.",
        });
        
        // Call the onReset callback to update the UI
        onReset();
        setOpen(false);
        
        // Clear ALL localStorage data
        localStorage.clear();
        
        // Force page reload to bring user back to profile creation
        // This ensures all state is completely reset
        window.location.reload();
      } else {
        toast({
          title: "Reset Failed",
          description: "Could not reset the game. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Reset Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Reset Game</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} /> Reset Game?
          </DialogTitle>
          <DialogDescription>
            This action will delete all player profiles, reset the leaderboard, and start a fresh new game.
            This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 my-2">
          <p className="font-medium">You are about to:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Delete all player profiles</li>
            <li>Reset the entire leaderboard</li>
            <li>Start a brand new game</li>
          </ul>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleReset}
            disabled={isResetting}
            className="gap-1"
          >
            {isResetting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Reset Game
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetGameButton;
