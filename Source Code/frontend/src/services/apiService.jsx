import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("access_token");
        }
        return Promise.reject(error);
    }
);

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

export const getCompetitions = async (filters) => {
    try {
        const params = new URLSearchParams();
        filters.forEach(f => params.append('filter', f));

        const response = await api.get("/competitions/filtered/", { params: params });
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju natjecanja:", error);
        return [];
    }
};

export const createCompetition = async (competitionData) => {
    try {
        const response = await api.post("/competitions/new/", competitionData);
        return response.data;
    } catch (error) {
        console.error("Greška pri kreiranju natjecanja:", error);
        throw error;
    }
};

export const createNewUser = async (userData) => {
    try {
        const response = await api.put("/users/auth/user_info/", userData);
        return response.data;
    } catch (error) {
        console.error("Greška pri ažuriranju profila:", error);
        throw error;
    }
};

export const getMyCompetitions = async () => {
    try {
        const response = await api.get("/competitions/my_competitions/");
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju natjecanja:", error);
        return [];
    }
};

export const publishCompetition = async (competitionId) => {
    try {
        const response = await api.put(
            `/competitions/${competitionId}/publish/`
        );
        return response.data;
    } catch (error) {
        console.error("Greška pri objavi natjecanja:", error);
        throw error;
    }
};

export const getCompetitionByID = async (competitionId) => {
    try {
        const response = await api.get(`/competitions/${competitionId}/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju natjecanja:", error);
        throw error;
    }
};

export const updateCompetition = async (competitionId, competitionData) => {
    try {
        const response = await api.put(
            `/competitions/${competitionId}/edit/`,
            competitionData
        );
        return response.data;
    } catch (error) {
        console.error("Greška pri ažuriranju natjecanja:", error);
        throw error;
    }
};

export const createOrder = async (comp_id) => {
    try {
        const response = await api.post(`/competitions/${comp_id}/create-order/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri kreiranju narudžbe:", error);
        throw error;
    }
};

export const signUpForCompetition = async (comp_id, formData) => {
    try {
        const response = await api.post(`/competitions/${comp_id}/signup/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Greška pri prijavi na natjecanje:", error);
        throw error;
    }
};

export const getSudci = async (competitionId) => {
    try {
        const response = await api.get(`/competitions/${competitionId}/get_judges/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju sudaca:", error);
        return [];
    }
};

export const inviteSudac = async (competitionId, email) => {
    try {
        const formData = new FormData();
        formData.append('email', email);

        const response = await api.post(`/competitions/${competitionId}/invite_judge/`, formData);
        return response.data;
    } catch (error) {
        console.error("Greška pri pozivanju suca:", error);
        throw error;
    }
};

export const getResults = async () => {
    try {
        const response = await api.get("/competitions/results/");
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju rezultata:", error);
        return [];
    }
};

export const getNastupi = async (competitionId) => {
    try {
        const response = await api.get(`/competitions/${competitionId}/appearances/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju nastupa:", error);
        return [];
    }
};

export const acceptNastup = async (competitionId, nastupId) => {
    try {
        const response = await api.put(`/competitions/${competitionId}/appearances/${nastupId}/accept/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri prihvaćanju nastupa:", error);
        throw error;
    }
};

export const rejectNastup = async (competitionId, nastupId) => {
    try {
        const response = await api.put(`/competitions/${competitionId}/appearances/${nastupId}/unaccept/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri odbijanju nastupa:", error);
        throw error;
    }
};

export const denyNastup = async (competitionId, nastupId) => {
    try {
        const response = await api.put(`/competitions/${competitionId}/appearances/${nastupId}/deny/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri opozivu nastupa:", error);
        throw error;
    }
};

export const closeCompetitionApplications = async (competitionId) => {
    try {
        const response = await api.post(`/competitions/${competitionId}/close_applications/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri zatvaranju prijava natjecanja:", error);
        throw error;
    }
};

export const getStartnaLista = async (competitionId) => {
    try {
        const response = await api.get(`/competitions/${competitionId}/starting_list/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju startne liste:", error);
        throw error;
    }
};

export const startCompetition = async (competitionId) => {
    try {
        const response = await api.put(`/competitions/${competitionId}/activate/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri pokretanju natjecanja:", error);
        throw error;
    }
};

export const finishCompetition = async (competitionId) => {
    try {
        const response = await api.post(`/competitions/${competitionId}/complete/`);
        return response.data;
    } catch (error) {
        console.error("Greška pri završetku natjecanja:", error);
        throw error;
    }
};

export const getMojiNastupi = async () => {
    try {
        const response = await api.get("/competitions/my_appearances/");
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju mojih nastupa:", error);
        return [];
    }
};

export const getSubscriptions = async () => {
    try {
        const response = await api.get("/users/subscribed/");
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvaćanju mojih pretplata:", error);
        return [];
    }
};

export const createSubscription = async () => {
    try {
        const response = await api.post("/users/create-subscription/");
        return response.data;
    } catch (error) {
        console.error("Greška pri kreiranju pretplate:", error);
        throw error;
    }
};

export const connectSubscription = async (paymentData) => {
    try {
        const response = await api.post("/users/paypal/success/", paymentData);
        return response.data;
    } catch (error) {
        console.error("Greška pri povezivanju pretplate:", error);
        throw error;
    }
};

export default api;