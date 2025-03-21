"use client";

import { getUser } from "@/lib/users/api";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getTracksByUser } from "@/lib/tracks/api";



type User = {
    id: string;
    username: string;
    email: string;
}

type Track = {
    id: string;
    name: string;
}


const Profile = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const { isSignedIn, user, isLoaded } = useUser();
    const [tracks, setTracks] = useState<Track[]>([]);


    useEffect(() => {
        const fetchUser = async () => {
            const response: User = await getUser();

            setUserData(response);
        }

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTracks = async () => {
            if (userData?.id) {
                const response = await getTracksByUser(userData.id);
                setTracks(response);
            }
        };

        fetchTracks();
    }, [userData]);


    if (!isLoaded) return <div>Loading...</div>;
    if (!isSignedIn) return <div>Sign in to view this page</div>;


    console.log("user", userData?.id);
    console.log("Tracks", tracks);

    return (
        <>
            <div className="flex items-center gap-8 mb-4">
                <Avatar className="w-28 h-28">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="text-4xl mb-4">{user?.username}</h1>
            </div>
            <Separator />
            <div>
                <h2 className="mt-2 text-xl">Tracks</h2>
                {tracks.length > 0 ? (
                    <ul className="mt-2 space-y-1 mb-4">
                        {tracks.map((track) => (
                            <li key={track.id} className="text-lg">
                                <p className="ml-2">{track.name}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2 mb-4">No tracks found.</p>
                )}

                <Separator />
            </div>
            <div>
                <h2 className="mt-2 text-xl">Contributions</h2>
                <Separator />
            </div>
        </>
    )
}

export default Profile;