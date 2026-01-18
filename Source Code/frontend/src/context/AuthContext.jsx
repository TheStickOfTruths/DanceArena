import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logoutUser } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const logout = () => {
        logoutUser();

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);