import '../styles/v-prijava-nastupa-odabir.css';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCompetitions } from '../services/apiService.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CompetitionMicro from '../components/competitionmicro.jsx';

function VprijavaNastupaOdabir() {

    const { user: currentUser, loading } = useAuth();
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.role !== 'CLUB_MANAGER') {
            navigate('/');
        }
        const fetchData = async () => {
            try {
                const response = await getCompetitions(["PUBLISHED"]);
                setCompetitions(response);
            } catch (error) {
                console.error("Greška pri dohvaćanju mojih natjecanja:", error);
            }
        };
        fetchData();
    }, [currentUser, navigate]);

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
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container'>
                <div className='headboard-v'>
                    <p>Prijava Timova</p>
                </div>

                <div className='competition-list-container'>
                    {competitions.length > 0 ? (
                        competitions.map((competition) => (
                            <CompetitionMicro
                                key={competition.id}
                                competition={competition}
                                onUpdate={null}
                            />
                        ))
                    ) : (
                        <p>Nema natjecanja za prikaz.</p>
                    )}
                </div>
            </div>
        </div>

    );
}

export default VprijavaNastupaOdabir