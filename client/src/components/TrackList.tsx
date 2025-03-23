import TrackCard from "./TrackCard";

interface Track {
  id: string;
  name: string;
  userId: string;
  contributors?: string[];
  genre: string;
  track: string;
}


export default function TrackList({ initialTracks }: { initialTracks: Track[] }) {

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {initialTracks.map((track) => (
        <TrackCard
          key={track.id}
          trackId={track.id}
          track={track.name}
          artist={track.userId}
          contributors={track.contributors}
          genre={track.genre}
          link={`/tracks/${track.id}`}
          audioUrl={track.track}
        />
      ))}
    </div>
  );
}
