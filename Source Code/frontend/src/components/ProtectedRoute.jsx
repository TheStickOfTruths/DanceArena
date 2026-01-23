import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");
    const { user, isSubscribed } = useAuth();

    if (!token) {
        return <Navigate to="/homepage" replace />;
    }

    if (user.role === "ORGANIZER" && !isSubscribed && window.location.pathname !== '/organizator/placanje') {
        return <Navigate to="/organizator/placanje" replace />;
    }

    return children;
};

export default ProtectedRoute;