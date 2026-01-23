import '../styles/s-odabir-natjecanja.css';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getJudgeCompetitions } from '../services/apiService.jsx';
import { useAuth } from "../context/AuthContext.jsx";
import CompetitionMicro from '../components/competitionmicro.jsx';

function SodabirNatjecanja() {
    const { user: currentUser, loading } = useAuth();
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompetitions = async () => {
            const data = await getJudgeCompetitions();
            setCompetitions(data);
        };
        fetchCompetitions();
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

    const handleCompetitionUpdate = (updatedCompetition) => {
        setCompetitions((prevCompetitions) =>
            prevCompetitions.map((competition) =>
                competition.id === updatedCompetition.id ? updatedCompetition : competition
            )
        );
    }

    return (
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='pejdz-content-container'>
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

                <div className='kompetisn-list-container'>
                    {competitions.map((competition) => (
                        <CompetitionMicro
                            key={competition.id}
                            competition={competition}
                            onUpdate={handleCompetitionUpdate}
                        />
                    ))}
                </div>
            </div>
        </div>

    );
}

export default SodabirNatjecanja