import ky from "ky";

const API_SOURCE = "otakudesu";

export const makeApiRequest = async (endpoint, params = {}) => {
  const url = `${process.env.API_URL}/${API_SOURCE}${endpoint}`;

  try {
    return await ky.get(url, { searchParams: params }).json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error?.message || error);
    return { data: null, pagination: {} };
  }
};
