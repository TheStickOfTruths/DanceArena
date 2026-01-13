import '../styles/o-placanje.css';
import Navbar from '../components/navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';

function Oplacanje() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCurrentUser();

                if (response) {
                    setCurrentUser(response);
                }
            } catch (error) {
                console.error("Greška u homepage.jsx:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="homepage-container">
                <Navbar currentUser={currentUser} />
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-container">
            <Navbar
                currentUser={currentUser} />
            <div className="homepage-content-container">
                <p>Članarina je istekla!</p>
                <p>Iznos članarine za ovu godinu iznosi {}. Molimo vas odaberite način plaćanja:</p>
                <button className="pay-button">Plati Paypalom</button>
            </div>
        </div>
    )
};

export default Oplacanje;