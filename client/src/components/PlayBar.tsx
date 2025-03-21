"use client";

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/users/api";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const PlayerBar = () => {
  const { currentTrack, currentArtist, isPlaying, togglePlay, closePlayer, isPlayerVisible } = useAudioPlayer();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!currentArtist) return;

    const fetchUser = async () => {
      try {
        const response = await getUserById(currentArtist);
        setUsername(response?.username);
      } catch (error) {
        console.error("Failed to fetch user: ", error);
      }
    };

    fetchUser();
  }, [currentArtist]);

  if (!isPlayerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-lg font-semibold">{currentTrack}</p>
        <p className="text-sm">{username || "Unknown Artist"}</p>
      </div>

      <div className="flex-1 flex justify-center">
        <Button onClick={togglePlay}>{isPlaying ? <Pause /> : <Play />}</Button>
      </div>

      <div className="flex-1"></div>
      <Button onClick={closePlayer} variant="ghost">
        <X />
      </Button>
    </div>
  );
};

export default PlayerBar;
