"use client";

import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/users/api";
import { useEffect, useState } from "react";

const PlayerBar = () => {
  const { track, artist, isPlaying, togglePlay } = useAudioPlayer();
  const [username, setUsername] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(artist);

        setUsername(response?.username);
      } catch (error) {
        console.error("Failed to fetch user: ", error);
      }
    };

    fetchUser();
  });

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-lg font-semibold">{track}</p>
        <p className="text-sm">{username}</p>
      </div>

      <div className="flex-1 flex justify-center">
        <Button onClick={togglePlay}>{isPlaying ? <Pause /> : <Play />}</Button>
      </div>

      <div className="flex-1"></div>
    </div>
  );
};

export default PlayerBar;
