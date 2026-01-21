import '../styles/opozivanjesudaca.css';
import Navbar from '../components/navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSudci, inviteSudac } from '../services/apiService.jsx';

const SudacMini = ({ sudac, onInvite }) => {
    return (
        <div className="sudac-mini">
            <p>{sudac.name} {sudac.surname} ({sudac.email})</p>
            <button
                className="pozovi-button"
                onClick={() => onInvite(sudac.email)}
            >
                Pozovi
            </button>
        </div>
    );
}

function OpozivanjeSudaca() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sudci, setSudci] = useState([]);
    const competition = location.state?.competition || null;
    const { user: currentUser, loading } = useAuth();

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

    const fetchSudci = async () => {
        try {
            const response = await getSudci(competition.id);

            console.log(response);

            setSudci(response);
        } catch (error) {
            console.error("Greška pri dohvaćanju sudaca:", error);
        }
    };

    useEffect(() => {
        if (currentUser.role !== 'ORGANIZER' || !competition) {
            navigate('/');
            return;
        }
        fetchSudci();
    }, [currentUser, competition, navigate]);

    const handleSudciInvite = async (e) => {
        e.preventDefault();
        const email = e.target.elements[0].value;
        await sendInvite(email);
    };

    const sendInvite = async (email) => {
        try {
            await inviteSudac(competition.id, email);
            fetchSudci();
        } catch (error) {
            console.error("Greška pri slanju pozivnice:", error);
            alert('Došlo je do greške pri slanju pozivnice.');
        }
    };

    if (!competition || !currentUser) return null;

    return (
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container-sudci'>
                <div className='headboard'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate(-1)}
                        >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Pozovi sudce za {competition.name}</p>
                </div>
                <div className="pozivanje-sudaca-content">
                    <div className="email-form">
                        <form onSubmit={handleSudciInvite}>
                            <input type="email" placeholder="Unesite email sudca" required />
                            <button type="submit">Pošalji pozivnicu</button>
                        </form>
                    </div>
                    <div className="sudci-lista">
                        {sudci.length > 0 ? <p>Popis postojećih sudaca:</p> : <p>Pozvao si sve sudce što postoje, molim te nemoj više!</p>}
                        <div className="sudci-scroll">
                            {sudci.map((sudac) => (
                                <SudacMini key={sudac.id} sudac={sudac} onInvite={sendInvite} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default OpozivanjeSudaca;