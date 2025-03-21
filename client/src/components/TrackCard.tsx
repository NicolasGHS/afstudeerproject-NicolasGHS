import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { getUserById } from "@/lib/users/api";
import { useEffect, useState } from "react";

interface TrackProps {
  trackId: string; // 📌 We gebruiken nu de ID in plaats van een enkele URL
  track: string;
  artist: string;
  contributors?: string[];
  needs?: string[];
  genre: string;
  link: string;
}

const TrackCard = ({ trackId, track, artist, contributors, needs, genre, link }: TrackProps) => {
  const router = useRouter();
  const { playTrack } = useAudioPlayer();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(artist);
        setUsername(response.username);
      } catch (error) {
        console.error("Failed to fetch user: ", error);
      }
    };

    fetchUser();
  }, [artist]);

  console.log('track id', trackId);

  const handlePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    playTrack(trackId); // 🎵 Geef de track ID mee om audio op te halen
  };

  const handleNavigate = () => {
    router.push(link);
  };

  return (
    <Card className="flex w-1/2 h-16 items-center justify-between pl-2 pr-2 cursor-pointer" onClick={handleNavigate}>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p>{track} - {username}</p>
        <p>Contributors: {contributors?.join(", ") || "None"}</p>
      </div>
      <div>
        <p>Needs: {needs?.join(", ") || "None"}</p>
      </div>
      <p>{genre}</p>
      <Button onClick={handlePlay}>
        <Play />
      </Button>
    </Card>
  );
};

export default TrackCard;
