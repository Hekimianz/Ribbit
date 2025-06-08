const base_url = import.meta.env.VITE_API_URL;

export const getUsersComments = async (name) => {
  try {
    const response = await fetch(`${base_url}/comments/${name}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('error fetching comments: ', error);
  }
};
