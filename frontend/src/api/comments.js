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

export const createComment = async (postId, text) => {
  try {
    const response = await fetch(`${base_url}/comments/post/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error posting comment: ', error);
  }
};
