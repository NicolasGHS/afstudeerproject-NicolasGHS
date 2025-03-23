"use client";

import { useEffect, useState } from "react";
import { getTrackById } from "@/lib/tracks/api";
import { getUserById } from "@/lib/users/api";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface Track {
  id: string;
  name: string;
  key: string;
  bpm: string;
  genre: string;
  instruments: string[];
}

interface User {
  id: string;
  username: string;
}

const Track = () => {
  const params = useParams();
  const { id } = params;
  const [track, setTrack] = useState<Track>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchTrack = async (id: string) => {
      try {
        const track = await getTrackById(id);

        setTrack(track);
      } catch (error) {
        console.error("failed to fetch Track");
      }
    };

    const fetchUser = async (id: string) => {
      console.log("Fetch user functie aangeroepen");
      try {
        const user = await getUserById(id);
        console.log("user", user);

        setUser(user);
      } catch (error) {
        console.error("failed to fetch User");
      }
    };

    fetchTrack(id);
    fetchUser("67bb8d477d53f8b3abdc8f3f");
  }, [id]);

  if (!track) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl">{track.name}</h1>
      <p className="mb-6 text-xl text-gray-200">{user?.username}</p>
      <div className="flex gap-4 mb-4">
        <p className="w-12">Key</p>
        <p>{track.key}</p>
      </div>
      <Separator className="w-3/4"/>
      <div className="flex gap-4 mb-4 mt-4">
        <p className="w-12">Bpm</p>
        <p>{track.bpm}</p>
      </div>
      <Separator className="w-3/4" />
      <div className="flex gap-4 mb-4 mt-4">
        <p className="w-12">Genre</p>
        <p>{track.genre}</p>
      </div>
      <Separator className="w-3/4" />
      <div className="mt-4">
        <ul className="list-none m-0 p-0">
          {track.instruments &&
            track.instruments.map((instrument, index) => (
              <li key={index}>{instrument}</li>
            ))}
        </ul>
      </div>
      <Button className="mt-4">
        <Link href={`/tracks/edit/${track.id}`}>Edit Track</Link>
      </Button>
    </div>
  );
};

export default Track;
