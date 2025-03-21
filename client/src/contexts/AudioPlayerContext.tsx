"use client";

import { createContext, useContext, useState, useRef } from "react";
import { getAudioTracksById } from "@/lib/tracks/api";

interface AudioPlayerContextType {
  isPlaying: boolean;
  playTrack: (trackId: string) => Promise<void>; // Speelt een track af op basis van ID
  togglePlay: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [tracks, setTracks] = useState<string[]>([]); // Track URLs
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef<HTMLAudioElement[]>([]); // Audio-element refs


  // 🎵 Functie om een track af te spelen op basis van ID
  const playTrack = async (trackId: string) => {

  console.log('trackId', trackId);
    try {
      const fetchedTracks = await getAudioTracksById(trackId); // Haal audio tracks op

      console.log('Fetched tracks', fetchedTracks);
      if (!fetchedTracks || fetchedTracks.length === 0) {
        console.warn("No audio tracks found for this track.");
        return;
      }

      const audioUrls = fetchedTracks.map((track: any) => track.trackUrl); // Extract URLs
      setTracks(audioUrls);
      setIsPlaying(true);

      // Start met afspelen
      setTimeout(() => {
        audioUrls.forEach((track, index) => {
          if (audioRefs.current[index]) {
            audioRefs.current[index].src = track;
            audioRefs.current[index].play();
          }
        });
      }, 100); // Even wachten om state updates te verwerken

    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  // ⏯️ Toggle play/pause
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);

    audioRefs.current.forEach((audio) => {
      if (audio) {
        isPlaying ? audio.pause() : audio.play();
      }
    });
  };

  return (
    <AudioPlayerContext.Provider value={{ isPlaying, playTrack, togglePlay }}>
      {children}
      {/* 🎵 Dynamisch audio-elementen aanmaken */}
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
