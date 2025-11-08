const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/users/me/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.log("APIService: Korisnik nije prijavljen ili nije autoriziran.");
                return null;
            }
            throw new Error(`APIService: HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        return userData;

    } catch (error) {
        console.error("APIService: Greška pri dohvaćanju trenutnog korisnika:", error);
        throw error;
    }
};