const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.log(
          "APIService: Korisnik nije prijavljen ili nije autoriziran."
        );
        return null;
      }
      throw new Error(`APIService: HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(
      "APIService: Greška pri dohvaćanju trenutnog korisnika:",
      error
    );
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/users/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`APIService: HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("APIService: Greška pri odjavi korisnika:", error);
    throw error;
  }
};

export const createCompetition = async (competitionData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/competitions/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
      body: JSON.stringify(competitionData),
    });
    if (!response.ok) {
      throw new Error(`APIService: HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("APIService: Greška pri kreiranju natjecanja:", error);
    throw error;
  }
};

export const getLiveCompetitions = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/competitions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`APIService: HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("APIService: Greška pri dohvaćanju živih natjecanja:", error);
    throw error;
  }
};
