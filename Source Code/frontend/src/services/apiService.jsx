const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// function getCookie(name) {
//   let cookieValue = "start";
//   if (document.cookie && document.cookie !== "") {
//     const cookies = document.cookie.split(";");
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   console.log("getcookie:" + cookieValue);
//   return cookieValue;
// }
//const csrftoken = getCookie("csrftoken");

export const exchangeCodeForToken = async (code) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/google/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to exchange code for token. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("APIService: Error exchanging code for token:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.log("APIService: No access token found.");
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/users/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.log("APIService: Token is invalid or expired.");
        localStorage.removeItem("accessToken");
        return null;
      }
      throw new Error(`APIService: HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("APIService: Error fetching current user:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  console.log("Tokens removed from storage. User logged out.");
  return Promise.resolve();
};

export const createCompetition = async (competitionData) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error(
      "APIService: No access token found. User is not authenticated."
    );
    console.error(error);
    throw error;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/competitions/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(competitionData),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.log("APIService: Token is invalid or expired.");
        logoutUser();
      }
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
