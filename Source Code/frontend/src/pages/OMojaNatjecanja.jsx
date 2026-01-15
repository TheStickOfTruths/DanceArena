import '../styles/omojanatjecanja.css';
import Navbar from '../components/navbar.jsx';
import { useEffect, useState } from 'react';
import { getMyCompetitions } from '../services/apiService.jsx';
import { useNavigate } from 'react-router-dom';
import CompetitionMicro from '../components/competitionmicro.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function OMojaNatjecanja() {

    const { user: currentUser, loading } = useAuth();
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMyCompetitions();
                setCompetitions(response);
            } catch (error) {
                console.error("Greška pri dohvaćanju mojih natjecanja:", error);
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

    function handleOupravljanjePrijavama() {
        navigate('/organizator/upravljanje-prijavama');
    }

    function handleCompetitionsUpdate(competition) {
        const updatedCompetitions = competitions.map((comp) =>
            comp.id === competition.id ? competition : comp
        );
        setCompetitions(updatedCompetitions);
    }

    return (
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container'>
                <div className='headboard'>
                    <p>Moja Natjecanja</p>
                </div>

                <div className='competition-list-container'>
                    {competitions.length > 0 ? (
                        competitions.map((competition) => (
                            <CompetitionMicro
                                key={competition.id}
                                competition={competition}
                                onUpdate={handleCompetitionsUpdate}
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

export default OMojaNatjecanja