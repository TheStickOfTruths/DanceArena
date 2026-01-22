import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logoutUser, getSubscriptions } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(true);

    const refreshUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("Greška pri osvježavanju korisnika:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const checkSubscription = async () => {
        try {
            const subscription = (await getSubscriptions()).is_subbed;
            setIsSubscribed(subscription);
            if (user && user.role === "ORGANIZER" && !isSubscribed) {
                if (window.location.pathname !== '/organizator/placanje') {
                    window.location.href = '/organizator/placanje';
                }
            }
        } catch (error) {
            console.error("Greška pri provjeri pretplate:", error);
            setIsSubscribed(false);
        }
    };

    const logout = () => {
        logoutUser();

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        setUser(null);
        setIsSubscribed(true);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    useEffect(() => {
        if (user) {
            checkSubscription();
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            refreshUser,
            logout,
            isSubscribed,
            setIsSubscribed,
            checkSubscription
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);