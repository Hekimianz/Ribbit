const base_url = import.meta.env.VITE_API_URL;

export const getAllPosts = async () => {
  try {
    const response = await fetch(`${base_url}/posts`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('error fetching posts: ', error);
  }
};

export const getPost = async (id) => {
  try {
    const response = await fetch(`${base_url}/posts/${id}`);
    if (response.ok) return await response.json();
    return null;
  } catch (error) {
    console.error('Error fetching post data: ', error);
  }
};
