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

export const getSub = async (name) => {
  try {
    const response = await fetch(`${base_url}/subs/${name}`);
    if (response.ok) return await response.json();
    return null;
  } catch (error) {
    console.error('Error fetching sub data: ', error);
  }
};
