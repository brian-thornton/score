export const get = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch GET error:', error);
    throw error;
  }
};

export const post = async (url: string, data: any, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch POST error:', error);
    throw error;
  }
};