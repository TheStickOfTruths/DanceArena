import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isAuthRequest =
    config.url.includes("auth/google") || config.url.includes("login");

  const token = localStorage.getItem("access_token");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginWithGoogle = async (googleAccessToken) => {
  try {
    const response = await api.post("/users/auth/google/", {
      access_token: googleAccessToken,
    });
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
  } catch (error) {
    console.error("Greška pri Google prijavi:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/auth/me/");

    if (response.data.authenticated) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error);
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/users/auth/logout/");
    return true;
  } catch (error) {
    console.warn("Greška pri backend logoutu:", error);
    return true;
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

export const getLiveCompetitions = async () => {
  try {
    const response = await api.get("/competitions/");
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju natjecanja:", error);
    return [];
  }
};

export const createCompetition = async (competitionData) => {
  const response = await api.post("/competitions/new/", competitionData);
  return response.data;
};

export default api;
