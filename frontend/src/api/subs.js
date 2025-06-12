const base_url = import.meta.env.VITE_API_URL;

export const getAllSubs = async () => {
  try {
    const response = await fetch(`${base_url}/subs`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching list of subs: ', error);
  }
};

export const getSub = async (name, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${base_url}/subs/${name}?page=${page}&limit=${limit}`
    );
    if (response.ok) return await response.json();
    return null;
  } catch (error) {
    console.error('Error fetching sub data: ', error);
  }
};
