"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from 'lucide-react';
import { useParams, useSearchParams } from "next/navigation";
import { getAllAudioTracksById, getAllPendingAudioTracksById } from "@/lib/tracks/api";
import { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import AudioTrack from "@/components/AudioTrack";
import { useWebSocket } from "@/contexts/WebSocketContext";

const Request = () => {
    const [audioTracks, setAudioTracks] = useState([]);
    const [pendingTracks, setPendingTracks] = useState([]);
    const { id } = useParams();
    const searchParams = useSearchParams();
    const notificationId = searchParams.get("notification");
    const [players, setPlayers] = useState<WaveSurfer[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const pendingAudioTracks = pendingTracks.filter((track) => track.status === "pending").map((track) => track.id);

    const { messages, removeMessage } = useWebSocket();


    const togglePlayAll = () => {
        if (isPlaying) {
            players.forEach((player) => player.pause());
        } else {
            players.forEach((player) => player.play());
        }
        setIsPlaying(!isPlaying);
    };

    function removeNotification(trackId, notificationId) {
        let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        notifications = notifications.filter(notification => notification.notificationId !== notificationId);
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    


    const acceptTracks = async () => {

        if (pendingAudioTracks.length === 0) {
            console.log("No tracks pending acceptance");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/audioTracks/accept", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackIds: pendingAudioTracks,
                }),
            });

            if (response.ok) {
                console.log("Tracks accepted successfully");
                // Update de status van de tracks naar "accepted" in de UI
                setAudioTracks((prevTracks) =>
                    prevTracks.map((track) =>
                        track.status === "pending" ? { ...track, status: "accepted" } : track
                    )
                );
                
                if (notificationId) {
                    removeMessage(Number(notificationId));
                }
            
            } else {
                console.error("Failed to accept tracks");
            }
        } catch (error) {
            console.error("Error accpting tracks: ", error);
        }
    }

    const declineTracks = async () => {    
        if (pendingAudioTracks.length === 0) {
            console.log("No pending tracks to decline");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8000/audioTracks/decline", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackIds: pendingAudioTracks,
                }),
            });
    
            if (response.ok) {
                console.log("Tracks declined successfully");
                // Verwijder de declined tracks uit de UI
                setAudioTracks((prevTracks) =>
                    prevTracks.filter((track) => track.status !== "pending")
                );

                if (notificationId) {
                    removeMessage(Number(notificationId));
                }
            } else {
                console.error("Failed to decline tracks");
            }
        } catch (error) {
            console.error("Error declining tracks: ", error);
        }
    };
    

    useEffect(() => {
        const getAudioTracks = async () => {
            const tracks = await getAllAudioTracksById(id);

            console.log("Tracks: ", tracks);

            setAudioTracks(tracks);
        };

        const getPendingAudioTracks = async () => {
            const tracks = await getAllPendingAudioTracksById(id);

            console.log("Pending tracks: ", tracks);

            setPendingTracks(tracks);
        }

        getAudioTracks();
        getPendingAudioTracks();
    }, [id]);

    console.log("audio tracks: ", audioTracks);


    return (
        <>
            {audioTracks.length > 0 && (
                <Button onClick={togglePlayAll} className="mt-4">
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
            )}

            {audioTracks.length > 0 ? (
                <div>
                    <div>
                        <Button variant="default" onClick={acceptTracks}>
                            Accept
                        </Button>
                        <Button variant="secondary" onClick={declineTracks}>
                            Decline
                        </Button>
                    </div>
                    {audioTracks.map((audioTrack) => (
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
                    ))}
                </div>
            ) : (
                <p>Geen audio tracks gevonden.</p>
            )}
        </>
    );
};

export default Request;
