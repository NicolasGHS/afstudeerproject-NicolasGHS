"use client";

import { getTracks } from "@/lib/tracks/api";
import Searchbar from "@/components/Searchbar";
import TrackList from "@/components/TrackList";
import Filter from "@/components/Filter";
// import AddButton from "@/components/AddButton";
import { useEffect, useState } from "react";
import UserInitializer from "@/lib/users/UserInitializer";


export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);  
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const tracks = await getTracks();
        setTracks(tracks);

        // Verzamel unieke genres uit de tracks
        const uniqueGenres = [
          ...new Set(tracks.map((track) => track.genre)) // Gebruik Set om unieke genres te krijgen
        ];
        setGenres(uniqueGenres); // Zet de unieke genres in de state
      } catch (error) {
        console.error("Failed to fetch tracks: ", error);
      }
    };

    fetchTracks();
  }, []);

  const filteredTracks = tracks.filter(track => {
    const matchesSearchTerm = track.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre ? track.genre === selectedGenre : true; // Als er geen genre is geselecteerd, wordt er niet gefilterd op genre
    return matchesSearchTerm && matchesGenre;
  });


  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4">
      <UserInitializer />
      <div className="flex gap-4 items-center mb-10">
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filter genres={genres} setSelectedGenre={setSelectedGenre} />
      </div>
      <TrackList initialTracks={filteredTracks} />
    </div>
  );
}
