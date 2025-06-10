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

export const getUsersPosts = async (name) => {
  try {
    const response = await fetch(`${base_url}/posts/user/${name}`);
    if (response.ok) return await response.json();
    return null;
  } catch (error) {
    console.error('Error fetching posts: ', error);
  }
};

export const createPost = async (title, textContent, subribbitId) => {
  try {
    const response = await fetch(`${base_url}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, textContent, subribbitId }),
    });
    if (response.ok) return await response.json();
    return await response.json();
  } catch (error) {
    console.error('Error creating post: ', error);
  }
};
