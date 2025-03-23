export async function getTracks() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const result = await response.json();

    return result.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch tracks: ", error);
    return [];
  }
}

export async function getTrackById(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/${id}`);

    if (response.ok) {
      const result = await response.json();

      return result.data?.data;
    } else {
      console.error("Failed to fetch track.");
    }
  } catch (error) {
    console.error("Failed to fetch track: ", error);
    return [];
  }
}

export async function getTracksByUser(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/user/${userId}`);

    console.log("response", response);

    if (response.ok) {
      const result = await response.json();

      return result.data?.data || [];
    } else {
      console.error("Failed to fetch tracks.");
    }
  } catch (error) {
    console.error("Failed to fetch tracks: ", error);
    return [];
  }
}

export async function getAudioTracksById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/audioTracks/${id}`,
    );

    if (response.ok) {
      const result = await response.json();
      console.log("result: ", result);

      return result.data?.data ?? [];
    } else {
      console.error("Failed to fetch audio tracks.");
    }
  } catch (error) {
    console.error("Failed to fetch audio tracks: ", error);
    return [];
  }
}

export async function getAllAudioTracksById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/allAudioTracks/${id}`,
    );

    if (response.ok) {
      const result = await response.json();
      console.log("result: ", result);

      return result.data?.data ?? [];
    } else {
      console.error("Failed to fetch audio tracks.");
    }
  } catch (error) {
    console.error("Failed to fetch audio tracks: ", error);
    return [];
  }
}

export async function getAllPendingAudioTracksById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/allPendingAudioTracks/${id}`,
    );

    if (response.ok) {
      const result = await response.json();
      console.log("result: ", result);

      return result.data?.data ?? [];
    } else {
      console.error("Failed to fetch audio tracks.");
    }
  } catch (error) {
    console.error("Failed to fetch audio tracks: ", error);
    return [];
  }
}

export const getTracksByContributor = async (userId: string) => {
  try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tracks/contributor/${userId}`);
      console.log("res", res);
      if (!res.ok) {
          throw new Error("Failed to fetch tracks");
      }
      const data = await res.json();
      return data.data?.data || [];
  } catch (error) {
      console.error("Error fetching contributor tracks:", error);
      return [];
  }
};
