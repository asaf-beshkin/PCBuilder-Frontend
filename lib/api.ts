export async function fetchComponentData(type) {
  try {
    const response = await fetch(`https://pcbuilder-backend.onrender.com/api/${type}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${type} data`);
    }
    const data = await response.json();
    // Return the JSON data directly since the API returns an array
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${type}:`, error);
    throw error;
  }
}

