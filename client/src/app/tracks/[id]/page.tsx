"use client";

import { useEffect, useState } from "react";
import { getTrackById } from "@/lib/tracks/api";
import { getUserById } from "@/lib/users/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Track = () => {
  const params = useParams();
  const { id } = params;
  const [track, setTrack] = useState();
  const [user, setUser] = useState();

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
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-xl">{track.name}</h1>
      <p>{user?.email}</p>
      <div className="grid grid-cols-2 gap-x-2 items-start">
        <div className="flex flex-col gap-1 text-right">
          <p>Key:</p>
          <p>Bpm:</p>
          <p>Genre:</p>
          <p>Instruments:</p>
        </div>
        <div className="flex flex-col gap-1">
          <p>{track.key}</p>
          <p>{track.bpm}</p>
          <p>{track.genre}</p>
          <ul className="list-none m-0 p-0">
            {track.instruments &&
              track.instruments.map((instrument, index) => (
                <li key={index}>{instrument}</li>
              ))}
          </ul>
        </div>
      </div>
      <Link href={`/tracks/edit/${track.id}`}>Edit Track</Link>
    </div>
  );
};

export default Track;
