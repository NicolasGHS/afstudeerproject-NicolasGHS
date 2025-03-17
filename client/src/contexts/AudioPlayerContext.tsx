"use client";

import { createContext, useContext, useState, useRef } from "react";

interface AudioPlayerContextType {
  track: string | null;
  artist: string | null;
  audioUrl: string | null;
  isPlaying: boolean;
  playTrack: (track: string, artist: string, audioUrl: string) => void;
  togglePlay: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

export const AudioPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [track, setTrack] = useState<string | null>(null);
  const [artist, setArtist] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: string, artist: string, audioUrl: string) => {
    setTrack(track);
    setArtist(artist);
    setAudioUrl(audioUrl);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        track,
        artist,
        audioUrl,
        isPlaying,
        playTrack,
        togglePlay,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider",
    );
  }
  return context;
};
