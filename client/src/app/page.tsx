"use client";

import { getTracks } from "@/lib/tracks/api";
import Searchbar from "@/components/Searchbar";
import TrackList from "@/components/TrackList";
import AddButton from "@/components/AddButton";
import { useEffect, useState } from "react";
import UserInitializer from "@/lib/users/UserInitializer";

export default function Home() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const tracks = await getTracks();
        setTracks(tracks);
      } catch (error) {
        console.error("Failed to fetch tracks: ", error);
      }
    };

    

    fetchTracks();
  }, []);


  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <UserInitializer />
      <div>
        <Searchbar />
      </div>
      <TrackList initialTracks={tracks} />
    </div>
  );
}
