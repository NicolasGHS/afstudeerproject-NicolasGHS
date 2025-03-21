import TrackCard from "./TrackCard";

export default function TrackList({ initialTracks }: { initialTracks: any[] }) {


  return (
    <div className="w-full flex flex-col items-center gap-5">
      {initialTracks.map((track) => (
        <TrackCard
          key={track.id}
          trackId={track.id}
          track={track.name}
          artist={track.userId}
          genre={track.genre}
          link={`/tracks/${track.id}`}
          audioUrl={track.track}
        />
      ))}
    </div>
  );
}
