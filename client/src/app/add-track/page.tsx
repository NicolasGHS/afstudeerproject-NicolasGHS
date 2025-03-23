"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/users/api";
import { getInstruments } from "@/lib/instruments/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { z } from "zod";

const addTrackFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Track name must be at least 2 characters.",
    })
    .max(55, {
      message: "Track name must not be longer than 30 characters.",
    }),
  key: z.string(),
  bpm: z.number(),
  genre: z.string(),
  // track: z.any().refine((file) => file instanceof File, {
  //   message: "You must upload a valid file.",
  // }),
  // instruments: z.array(
  //   z.object({
  //     value: z.string(),
  //   }),
  // ),
});

type AddTrackFormValues = z.infer<typeof addTrackFormSchema>;

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );

const defaultValues: Partial<AddTrackFormValues> = {
  name: "Track name",
  key: "D",
  bpm: 100,
  genre: "Techno",
  // instruments: [{ value: "Guitar" }],
};

const AddTrack = () => {
  const router = useRouter();
  // const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState();
  // console.log("tracks", tracks);
  const form = useForm<AddTrackFormValues>({
    resolver: zodResolver(addTrackFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // const { fields, append } = useFieldArray({
  //   name: "instruments",
  //   control: form.control,
  // });

  useEffect(() => {
    // async function fetchInstruments() {
    //   const data = await getInstruments();
    //   setTracks(data);
    // }

    async function fetchUser() {
      const user = await getUser();

      console.log("User: ", user);

      setUser(user);
    }

    // fetchInstruments();
    fetchUser();
  }, []);

  // async function uploadTrack(file: File) {
  //   const filePath = `${Date.now()}_${file.name}`;
  //   const { data, error } = await supabase.storage
  //     .from("Tracks")
  //     .upload(filePath, file);

  //   if (error) {
  //     console.error("Error uploading file: ", error);
  //     return null;
  //   }

  //   return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Tracks/${filePath}`;
  // }

  async function onSubmit(data: AddTrackFormValues) {
    console.log("Submitting form...", data);

    const bpm = parseInt(data.bpm.toString(), 10);
    if (isNaN(bpm)) {
      console.error("BPM is not a valid number.");
      return;
    }

    // const fileUrl = await uploadTrack(data.track);
    // if (!fileUrl) {
    //   console.error("Failed to upload file to Supabase.");
    //   return;
    // }

    try {
      // Add Track
      const trackResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          key: data.key,
          bpm: data.bpm,
          genre: data.genre,
          // instruments: data.instruments.map((instrument) => instrument.value),
          // track: fileUrl,
          userId: user?.id,
        }),
      });

      console.log("trackResponse", trackResponse);
      // console.log("response: ", response.text());

      const requestBody = {
        name: data.name,
        key: data.key,
        bpm: data.bpm,
        genre: data.genre,
        // instruments: data.instruments.map((instrument) => instrument.value),
        track: data.track,
        userId: user?.id,
      };
      console.log("Request body:", requestBody);

      if (!trackResponse.ok) {
        throw new Error(`Error: ${trackResponse.status}`);
      }

      const trackResult = await trackResponse.json();
      console.log("Track Added: ", trackResult);

      const trackId = trackResult?.data?.id;

      // console.log("TrackId: ", trackId);

      // if (!trackId) {
      //   throw new Error("TrackId not found");
      // }

      // Add AudioTrack
      // const audioTrackResponse = await fetch(
      //   "http://localhost:8000/audioTracks",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       name: data.name,
      //       contributor: user?.id, // Dit kun je aanpassen aan je user-object
      //       trackId: trackId,
      //       trackUrl: fileUrl,
      //       instrument: data.instruments.map((inst) => inst.value).join(", "), // Converteer array naar string
      //     }),
      //   },
      // );

      // if (!audioTrackResponse.ok) {
      //   throw new Error(
      //     `Error adding audioTrack: ${audioTrackResponse.status}`,
      //   );
      // }

      // console.log("AudioTrack added");

      form.reset();
      router.push(`/tracks/edit/${trackId}`);
    } catch (error) {
      console.error("Failed to add track: ", error);

      if (error.response) {
        console.log("Server responded with:", await error.response.text());
      }
    }
  }

  console.log(user?.id);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Track name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bpm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bpm</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="bpm"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="genre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddTrack;
