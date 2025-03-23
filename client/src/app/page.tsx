"use client";

import { getTracks } from "@/lib/tracks/api";
import Searchbar from "@/components/Searchbar";
import TrackList from "@/components/TrackList";
// import AddButton from "@/components/AddButton";
import { useEffect, useState } from "react";
import UserInitializer from "@/lib/users/UserInitializer";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredTracks = tracks.filter(track =>
    track.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <UserInitializer />
      <div>
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <TrackList initialTracks={filteredTracks} />
    </div>
  );
}
