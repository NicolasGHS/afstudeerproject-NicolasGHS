"use client";

import { createContext, useContext, useState, useRef } from "react";
import { getAudioTracksById } from "@/lib/tracks/api";

interface AudioPlayerContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  currentArtist: string | null;
  playTrack: (trackId: string, trackName: string, artistId: string) => Promise<void>;
  togglePlay: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [tracks, setTracks] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentArtist, setCurrentArtist] = useState<string | null>(null); 
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const playTrack = async (trackId: string, trackName: string, artistId: string) => {
    try {
      const fetchedTracks = await getAudioTracksById(trackId);
      if (!fetchedTracks || fetchedTracks.length === 0) {
        console.warn("No audio tracks found for this track.");
        return;
      }

      const audioUrls = fetchedTracks.map((track: any) => track.trackUrl);
      setTracks(audioUrls);
      setCurrentTrack(trackName);
      setCurrentArtist(artistId);
      setIsPlaying(true);

      setTimeout(() => {
        audioUrls.forEach((track, index) => {
          if (audioRefs.current[index]) {
            audioRefs.current[index].src = track;
            audioRefs.current[index].play();
          }
        });
      }, 100);

    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    audioRefs.current.forEach((audio) => {
      if (audio) {
        isPlaying ? audio.pause() : audio.play();
      }
    });
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentArtist,
        playTrack,
        togglePlay,
      }}
    >
      {children}
      {tracks.map((_, index) => (
        <audio key={index} ref={(el) => (audioRefs.current[index] = el!)} />
      ))}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};
