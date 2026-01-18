import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/homepage" replace />;
    }

    return children;
};

export default ProtectedRoute;