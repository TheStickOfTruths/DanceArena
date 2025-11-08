const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const APIService = {
    /**
     * Dohvaća podatke o trenutno prijavljenom korisniku s Django backenda.
     * Očekuje da je backend već postavio session cookie nakon OAuth prijave.
     * @returns {Promise<Object|null>} Objekt korisnika ako je prijavljen, null inače.
     * @throws {Error} Ako dođe do problema s mrežom ili API-jem (osim 401/403).
     */
    getCurrentUser: async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/users/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.log("APIService: Korisnik nije prijavljen ili nije autoriziran.");
                    return null; // Vrati null umjesto bacanja greške za ove statuse
                }
                // Za ostale HTTP greške, baci grešku
                throw new Error(`APIService: HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            return userData;

        } catch (error) {
            console.error("APIService: Greška pri dohvaćanju trenutnog korisnika:", error);
            throw error; // Proslijedi grešku dalje komponentama
        }
    },
};

export default APIService;