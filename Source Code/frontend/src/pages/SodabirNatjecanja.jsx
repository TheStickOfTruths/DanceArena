import '../styles/s-odabir-natjecanja.css';
import Navbar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';

function SodabirNatjecanja() {
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

    function handleSocijeniNatjecanje() {
        navigate('/sudac/ocijeni-natjecanje');
    }

    return (
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container'>
                <div className='headboard-s'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate('/profile')}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Odabir natjecanja</p>
                </div>

                <div className='competition-list-container'>
                    <div className='competition'>
                        <p>Natjecanje 1</p>
                        <button className='prijava-button' label="1" onClick={handleSocijeniNatjecanje}>Ocijeni nastupe</button>
                    </div>
                    <div className='competition'>
                        <p>Natjecanje 2</p>
                        <button className='prijava-button' label="2" onClick={handleSocijeniNatjecanje}>Ocijeni nastupe</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SodabirNatjecanja