import '../styles/omojanatjecanja.css';
import '../styles/OdetaljiNatjecanja.css';
import Navbar from '../components/navbar.jsx';
import { useEffect, useState } from 'react';
import { getNastupi, getStartnaLista } from '../services/apiService.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NastupMini = ({ nastup, competitionID, setNastupi }) => {
    const [expanded, setExpanded] = useState(false);

    const handlePreuzmiGlazbu = (e) => {
        e.stopPropagation();
        if (!nastup.music_link) {
            console.error("Nema linka za glazbu.");
            return;
        }

        window.open(nastup.music_link, '_blank');
    };

    return (
        <div
            className={`nastup-mini ${expanded ? 'expanded' : ''} ${nastup.accepted ? 'accepted-bg' : ''}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="nastup-header">
                <div className="nastup-info">
                    <p className="nastup-title">{nastup.choreography}</p>
                    <p className="nastup-subtitle">{nastup.club_manager} | {nastup.choreograph}</p>
                </div>
                <div className="nastup-actions">
                    <button
                        className="prihvati-btn"
                        onClick={handlePreuzmiGlazbu}
                    >
                        Preuzmi glazbu
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="nastup-details">
                    <div className="detail-row">
                        <span>Trajanje:</span> {nastup.length}
                    </div>
                    <div className="detail-row">
                        <span>Kategorije:</span> {nastup.age_category} / {nastup.style_category} / {nastup.group_size_category}
                    </div>
                </div>
            )}
        </div>
    );
};



function ODetaljiNatjecanja() {

    const { user: currentUser, loading } = useAuth();
    const location = useLocation();
    const competition = location.state?.competition || null;
    const [nastupi, setNastupi] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNastupi = async () => {
            if (competition) {
                const data = await getNastupi(competition.id);
                setNastupi(data);
            }
        };
        fetchNastupi();
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

    const handleGetStartnaLista = async (e) => {
        e.stopPropagation();
        try {
            const startList = await getStartnaLista(competition.id);
            window.open(startList.link, '_blank');
        } catch (error) {
            console.error("Greška pri dohvaćanju startne liste:", error);
        }
    };


    return (
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container'>
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
                    <p>Detalji Natjecanja</p>
                </div>
                <div className='competition-list-container'>
                    {nastupi.length === 0 ? (
                        <p className="no-competitions-message">Nema nastupa za prikazati.</p>
                    ) : (
                        nastupi.map((nastup) => (
                            <NastupMini
                                key={nastup.id}
                                nastup={nastup}
                                competitionID={competition.id}
                                setNastupi={setNastupi}
                            />
                        ))
                    )}
                    <div className="startna-lista-button" onClick={handleGetStartnaLista}>Preuzmi startnu listu</div>
                </div>
            </div>
        </div>

    );
}

export default ODetaljiNatjecanja;