import axios from "axios";

const API_BASE = "http://localhost:8000/api/resources";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Configure headers with token
const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const searchResources = async (query, filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/search`, {
      params: {
        q: query,
        include_videos: filters.videos !== false,
        include_webpages: filters.webpages !== false,
        include_wikipedia: filters.wikipedia !== false,
      },
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error searching resources:", error);
    throw error;
  }
};

export default {
  searchResources,
};
