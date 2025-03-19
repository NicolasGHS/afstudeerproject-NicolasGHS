"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from 'lucide-react';
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import AudioTrack from "@/components/AudioTrack";



const Request = () => {
    const [audioTracks, setAudioTracks] = useState([]);
    const { id } = useParams();
    const [players, setPlayers] = useState<WaveSurfer[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayAll = () => {
        if (isPlaying) {
          players.forEach((player) => player.pause());
        } else {
          players.forEach((player) => player.play());
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {

    })
    

    return (
        <>
            {audioTracks.length > 0 && (
                <Button onClick={togglePlayAll} className="mt-4">
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
            )}
            {audioTracks.length > 0 ? (
                audioTracks.map((audioTrack) => (
                    <div key={audioTrack.id} className="flex items-center space-x-4">
                        <div className="w-32 flex flex-col items-center justify-center text-center">
                            <p>{audioTrack.name}</p>
                            <p>{audioTrack.instrument}</p>
                        </div>
                        <AudioTrack
                            src={audioTrack.trackUrl}
                            name={audioTrack.name}
                            instrument={audioTrack.instrument}
                            registerPlayer={(player) =>
                                setPlayers((prev) => [...prev, player])
                            }
                        />
                    </div>
                ))
            ) : (
                <p>Geen audio tracks gevonden.</p>
            )}
        </>
    )
}

export default Request;