import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { getUser, getUserById } from "@/lib/users/api";
import { useEffect, useState } from "react";

interface TrackProps {
  track: string;
  artist: string;
  contributors?: string[];
  needs?: string[];
  genre: string;
  link: string;
  audioUrl: string;
}

const TrackCard = ({
  track,
  artist,
  contributors,
  needs,
  genre,
  link,
  audioUrl,
}: TrackProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { playTrack } = useAudioPlayer();
  const [username, setUsername] = useState();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(artist);


        setUsername(response.username);
      } catch (error) {
        console.error("Failed to fetch user: ", error);
      }
    }

    fetchUser();
  })

  console.log(username);

  const handlePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    playTrack(track, artist, audioUrl);
  };

  const handleNavigate = () => {
    router.push(link);
  };

  return (
    <Card
      className="flex w-1/2 h-16 items-center justify-between pl-2 pr-2"
      onClick={handleNavigate}
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p>
          {track} - {username}
        </p>
        <p>Contributors: </p>
      </div>
      <div>
        <p>Needs:</p>
      </div>
      <p>{genre}</p>
      <Button onClick={handlePlay}>
        <Play />
      </Button>
    </Card>
  );
};

export default TrackCard;
