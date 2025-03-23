import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { getUserById } from "@/lib/users/api";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


interface TrackProps {
  trackId: string;
  track: string;
  artist: string;
  contributors?: string[];
  needs?: string[];
  genre: string;
  link: string;
  audioUrl: string;
}

const TrackCard = ({ trackId, track, artist, contributors, needs, genre, link }: TrackProps) => {
  const router = useRouter();
  const { playTrack } = useAudioPlayer();
  const [username, setUsername] = useState<string | null>(null);
  const [contributorUsers, setContributorUsers] = useState<{ username: string; avatar: string }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  useEffect(() => {
    const fetchContributors = async () => {
      if (!contributors || contributors.length === 0) return;

      try {
        const users = await Promise.all(contributors.map(async (id) => {
          const user = await getUserById(id);
          return user ? { username: user.username, avatar: user.avatar } : { username: "Onbekend", avatar: "" };
        }));

        setContributorUsers(users);
      } catch (error) {
        console.error("Failed to fetch contributors: ", error);
      }
    };

    fetchContributors();
  }, [contributors]);

  console.log('track id', trackId);
  // console.log('contributors', contributorNames);
  console.log('contributors', contributorUsers);

  const handlePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    playTrack(trackId, track, artist);
  };

  const handleNavigate = () => {
    router.push(link);
  };

  return (
    <Card className="flex w-1/2 h-16 items-center justify-between pl-2 pr-2 cursor-pointer">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2" onClick={handleNavigate}>
          <p className="hover:underline text-l">{track}</p>
          <p>-</p>
          <p className="hover:underline text-gray-400">{username}</p>
        </div>
        <p className="flex items-center gap-2">
          {contributorUsers.slice(0, 3).map((c, i) => (
            <span key={i} className="flex items-center text-gray-400 text-sm">
              {c.username}
            </span>
          ))}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}> {/* Track dialog open state */}
            <DialogTrigger onClick={(e) => e.stopPropagation()} className="hover:underline text-gray-400 text-sm">
              {contributorUsers.length > 3 && ` +${contributorUsers.length - 3} meer`}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contributors</DialogTitle>
                <DialogDescription>
                  {contributorUsers.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {contributorUsers.map((c, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={c.avatar || "https://via.placeholder.com/40"} />
                            <AvatarFallback>{c.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {c.username}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Geen contributors beschikbaar.</p>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </p>
      </div>
      <div>
        <p className="text-gray-400">Needs: {needs?.join(", ") || "None"}</p>
      </div>
      <p className="text-gray-400">{genre}</p>
      <Button onClick={handlePlay}>
        <Play />
      </Button>
    </Card>
  );
};

export default TrackCard;
