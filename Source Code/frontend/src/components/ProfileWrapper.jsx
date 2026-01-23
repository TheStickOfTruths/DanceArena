import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

import ProfileOrganizator from '../pages/profile-o';
import ProfileVoditelj from '../pages/profile-v';
import ProfileSudac from '../pages/profile-s';

const ProfileWrapper = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Učitavanje...</div>;

    if (!user) return <Navigate to="/" replace />;

    switch (user.role) {
        case 'ORGANIZER':
            return <ProfileOrganizator />;

        case 'CLUB_MANAGER':
            return <ProfileVoditelj />;

        case 'JUDGE':
            return <ProfileSudac />;

        default:
            return <Navigate to="/registracija" replace />;
    }
};

export default ProfileWrapper;