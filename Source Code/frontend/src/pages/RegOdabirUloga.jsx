import '../styles/reg-odabir-uloga.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RegOdabirUloga() {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    if (loading) {
        return (
            <div className="homepage-container">
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

    function handleORegistracija() {
        navigate('/registracija/organizator');
    }

    function handleVRegistracija() {
        navigate('/registracija/vodjitelj');
    }

    function handleSRegistracija() {
        navigate('/registracija/sudac');
    }

    return (
        <div className="role-selection-container">
            <div className="role-selection-content-container">
                <p>Dobrodošli!</p>
                <p>Odaberite svoju ulogu:</p>
                <div className='role-container'>
                    <div className='role-card-o' onClick={handleORegistracija}>Organizator</div>
                    <div className='role-card-v' onClick={handleVRegistracija}>Voditelj</div>
                    <div className='role-card-s' onClick={handleSRegistracija}>Sudac</div>
                </div>
            </div>
        </div>
    )
};

export default RegOdabirUloga;