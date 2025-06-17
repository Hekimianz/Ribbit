const base_url = import.meta.env.VITE_API_URL;

export const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${base_url}/posts?page=${page}&limit=${limit}`
    );
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

export const createPost = async (formData) => {
  try {
    const response = await fetch(`${base_url}/posts`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unknown Error');
    return data;
  } catch (error) {
    console.error('Error creating post: ', error);
  }
};

export const deletePost = async (id) => {
  try {
    const response = await fetch(`${base_url}/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unknown Error');
    return data;
  } catch (error) {
    console.error('Error deleting post: ', error);
  }
};
