import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { createUserProfile, getUserProfile } from "@/integrations/supabase/client";
import Marquee from "react-fast-marquee";

type Props = {};

const rowOneImages = [
  { url: "https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
];

const rowTwoImages = [
  { url: "https://images.pexels.com/photos/3958516/pexels-photo-3958516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/161276/moscow-cathedral-mosque-prospekt-mira-ramadan-sky-161276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/441379/pexels-photo-441379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { url: "https://images.pexels.com/photos/189833/pexels-photo-189833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
];

interface UserProfileFormProps {
  onProfileCreated: (username: string) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onProfileCreated }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const existingProfile = await getUserProfile(username);

    if (existingProfile) {
      toast({
        title: "Welcome back!",
        description: `Signed in as ${username}`,
      });
      onProfileCreated(username);
    } else {
      // Create new profile
      const newProfile = await createUserProfile(username);

      if (newProfile) {
        toast({
          title: "Profile Created",
          description: `Welcome to Globetrotter, ${username}!`,
        });
        onProfileCreated(username);
      } else {
        toast({
          title: "Error",
          description: "Failed to create profile. Please try a different username.",
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Marquee Sliders with Blur Effect */}
      <div className="w-full absolute">
        <div className="rotate-[-4deg] mt-10 md:mt-[6.5rem]">
          <Marquee>
            {rowOneImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt="slider"
                className="md:m-4 w-[200px] m-2 md:w-[500px] rounded-[20px] blur-sm"
              />
            ))}
          </Marquee>
          <Marquee>
            {rowTwoImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt="slider"
                className="md:m-4 w-[200px] m-2 md:w-[500px] rounded-[20px] blur-sm"
              />
            ))}
          </Marquee>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="glass rounded-2xl p-8 shadow-lg bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-md border border-black/90">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create Your Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a unique username"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Creating Profile..." : "Let's Go!"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;