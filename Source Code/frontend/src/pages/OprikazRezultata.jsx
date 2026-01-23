import '../styles/o-upravljanje-prijavama.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { getResults } from '../services/apiService.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import ResultMini from "../components/resultmini.jsx";

function OprikazRezultata() {

    const { user: currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const competition = location.state?.competition || null;
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (competition) {
            const fetchResults = async () => {
                try {
                    const data = await getResults();
                    data.forEach(item => {
                        if (item.competition_id === competition.id) {
                            setResult(item);
                        }
                    });
                } catch (error) {
                    console.error("Error fetching results:", error);
                }
            };
            fetchResults();
        }
    }, [competition]);

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
        <div className='stranica-container'>
            <Navbar currentUser={currentUser} />

            <div className='stranica-content-container'>
                <div className='headboard'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate('/organizator/moja-natjecanja')}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Prikaz rezultata za: {competition.name}</p>
                </div>
                <div className="results-container">
                    {result && <ResultMini result={result} />}
                </div>
            </div>
        </div >

    );
}

export default OprikazRezultata;