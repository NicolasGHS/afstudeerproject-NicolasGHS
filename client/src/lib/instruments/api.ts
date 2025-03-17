export async function getInstruments() {
  try {
    const response = await fetch("http://localhost:8000/instruments");

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const result = await response.json();
    return result.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch instruments: ", error);
    return [];
  }
}

export async function getInstrumentById(id: string) {
  try {
    const response = await fetch(`http://localhost:8000/instruments/${id}`);

    if (response.ok) {
      const result = await response.json();

      return result.data?.data;
    } else {
      console.error("Failed to fetch instruments");
    }
  } catch (error) {
    console.error("Failed to fetch instruments: ", error);
    return [];
  }
}
