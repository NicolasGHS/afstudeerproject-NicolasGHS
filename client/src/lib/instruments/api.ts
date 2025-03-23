export async function getInstruments() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instruments`);

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instruments/${id}`);

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
