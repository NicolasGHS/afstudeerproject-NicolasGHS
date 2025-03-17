"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioTrack = ({
  src,
  name,
  instrument,
  registerPlayer,
}: {
  src: string;
  registerPlayer: (player: WaveSurfer) => void;
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4A90E2",
        progressColor: "#357ABD",
        cursorColor: "#FF0000",
        barWidth: 2,
        height: 80,
      });

      wavesurfer.load(src);
      wavesurferRef.current = wavesurfer;

      registerPlayer(wavesurfer); // Speler registreren bij parent component

      return () => wavesurfer.destroy();
    }
  }, [src]);

  return (
    <div className="p-4 border rounded-lg w-5/6 mx-auto bg-gray-900 text-white">
      <div>
        {/* <p>{name}</p> */}
        {/* <p>{instrument}</p> */}
      </div>
      <div ref={waveformRef} className="w-full" />
    </div>
  );
};

export default AudioTrack;
