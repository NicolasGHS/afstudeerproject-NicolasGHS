"use client";

import AudioTrack from "@/components/AudioTrack";
import { useParams } from "next/navigation";
import { getAudioTracksById } from "@/lib/tracks/api";
import { createClient } from "@supabase/supabase-js";
import { getInstruments } from "@/lib/instruments/api";
import { getUser } from "@/lib/users/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Pause, Play } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import WaveSurfer from "wavesurfer.js";

const addAudioTrackSchema = z.object({
  instrument: z.string().min(1, "Kies een instrument"),
  trackFile: z.instanceof(File, {
    message: "Je moet een geldig audiobestand uploaden.",
  }),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const EditTrack = () => {
  const [audioTracks, setAudioTracks] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [user, setUser] = useState();
  const { id } = useParams();
  const [players, setPlayers] = useState<WaveSurfer[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const togglePlayAll = () => {
    if (isPlaying) {
      players.forEach((player) => player.pause());
    } else {
      players.forEach((player) => player.play());
    }
    setIsPlaying(!isPlaying);
  };

  console.log("user", user);

  const form = useForm({
    resolver: zodResolver(addAudioTrackSchema),
    mode: "onChange",
  });

  async function uploadTrack(file: File) {
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("Tracks")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file: ", error);
      return null;
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Tracks/${filePath}`;
  }

  async function onSubmit(data) {
    console.log("Form data:", data);

    const fileUrl = await uploadTrack(data.trackFile);
    if (!fileUrl) {
      console.error("Failed to upload file to Supabase.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/audioTracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Track ${Date.now()}`,
          contributor: user?.id,
          trackId: id,
          trackUrl: fileUrl,
          instrument: data.instrument,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error in API response:", response.status, errorText);
        return;
      }

      console.log("AudioTrack added successfully!");
      form.reset();

      router.push(`/tracks/${id}`);

      // Herlaad de audiotracks
      const updatedTracks = await getAudioTracksById(id);
      setAudioTracks(updatedTracks);
    } catch (error) {
      console.error("Failed to add audio track:", error);
    }
  }

  useEffect(() => {
    const getAudioTracks = async () => {
      const tracks = await getAudioTracksById(id);

      console.log("Tracks: ", tracks);

      setAudioTracks(tracks);
    };

    const getInstrumentsData = async () => {
      const instrumentsData = await getInstruments();

      setInstruments(instrumentsData);
    };

    const fetchUser = async () => {
      const user = await getUser();

      setUser(user);
    };

    getAudioTracks();
    getInstrumentsData();
    fetchUser();
  }, [id]);

  console.log("Audio tracks: ", audioTracks);

  return (
    <>
      {audioTracks.length > 0 && (
        <Button onClick={togglePlayAll} className="mt-4">
          {isPlaying ? <Pause /> : <Play />}
        </Button>
      )}
      {audioTracks.length > 0 ? (
        audioTracks.map((audioTrack) => (
          <div key={audioTrack.id} className="flex items-center space-x-4">
            <div className="w-32 flex flex-col items-center justify-center text-center">
              <p>{audioTrack.name}</p>
              <p>{audioTrack.instrument}</p>
            </div>
            <AudioTrack
              src={audioTrack.trackUrl}
              name={audioTrack.name}
              instrument={audioTrack.instrument}
              registerPlayer={(player) =>
                setPlayers((prev) => [...prev, player])
              }
            />
          </div>
        ))
      ) : (
        <p>Geen audio tracks gevonden.</p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Instrument selecteren */}
          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kies een instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map((instrument) => (
                        <SelectItem key={instrument.id} value={instrument.name}>
                          {instrument.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bestand uploaden */}
          <FormField
            control={form.control}
            name="trackFile"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Audio bestand</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Toevoegen</Button>
        </form>
      </Form>
    </>
  );
};

export default EditTrack;
