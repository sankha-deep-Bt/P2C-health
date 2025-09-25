export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
};
