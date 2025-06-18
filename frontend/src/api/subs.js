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

export const subscribeToSub = async (subribbitName) => {
  try {
    const response = await fetch(`${base_url}/subs/subscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subribbitName }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return null;
  } catch (error) {
    console.error('Error subscribing to sub: ', error);
  }
};

export const unsubscribeFromSub = async (subribbitName) => {
  try {
    const response = await fetch(`${base_url}/subs/unsubscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subribbitName }),
    });
    const data = await response.json();
    if (response.ok) return data;
    return null;
  } catch (error) {
    console.error('Error unsubscribing to sub: ', error);
  }
};

export const getSubscriptions = async () => {
  try {
    const response = await fetch(`${base_url}/subs/subscriptions`, {
      credentials: 'include',
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting list of subscriptions: ', error);
  }
};
