export async function getTracks() {
  try {
    const response = await fetch("http://localhost:8000/tracks");
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
    const response = await fetch(`http://localhost:8000/tracks/${id}`);

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
    const response = await fetch(`http://localhost:8000/tracks/user/${userId}`);

    console.log("response", response);

    if (response.ok) {
      const result = await response.json();

      return result.data?.data;
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
      `http://localhost:8000/tracks/audioTracks/${id}`,
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
      `http://localhost:8000/tracks/allAudioTracks/${id}`,
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
      `http://localhost:8000/tracks/allPendingAudioTracks/${id}`,
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