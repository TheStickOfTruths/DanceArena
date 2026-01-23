import '../styles/s-odabir-natjecanja.css';
import Navbar from '../components/navbar.jsx';
import { useEffect, useState } from 'react';
import { getNastupi, gradeCompetition } from '../services/apiService.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NastupMini = ({ nastup, competitionID, setNastupi }) => {
    const [expanded, setExpanded] = useState(false);
    const [score, setScore] = useState('');

    const handleOcjenjivanje = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (score === '' || score < 0 || score > 30) {
            alert("Molimo unesite valjanu ocjenu od 0 do 30.");
            return;
        }

        try {
            await gradeCompetition(competitionID, nastup.id, parseInt(score, 10));

            setNastupi(prevNastupi =>
                prevNastupi.map(n =>
                    n.id === nastup.id ? { ...n, graded: true } : n
                )
            );
        } catch (error) {
            alert("Greška prilikom ocjenjivanja. Pokušajte ponovno.");
        }
    };

    const handleScoreChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setScore('');
            return;
        }

        const numVal = parseInt(val, 10);

        if (!isNaN(numVal) && numVal >= 0 && numVal <= 30) {
            setScore(String(numVal));
        }
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
                    {!nastup.graded ?
                        (
                            <form className="grading-form" onSubmit={handleOcjenjivanje} onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    step="1"
                                    value={score}
                                    placeholder="0-30"
                                    onChange={handleScoreChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="grade-input"
                                />
                                <button
                                    type="submit"
                                    className="prihvati-btn"
                                >
                                    Ocijeni
                                </button>
                            </form>
                        ) :
                        (<span className="not-graded-label">Ocjena spremljena</span>)}
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

function SocijeniNatjecanje() {
    const { user: currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const competition = location.state?.competition || null;
    const [nastupi, setNastupi] = useState([]);

    useEffect(() => {
        const fetchNastupi = async () => {
            if (competition) {
                const data = await getNastupi(competition.id);
                setNastupi(data);
                console.log(data);
            }
        };
        fetchNastupi();
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
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='pejdz-content-container'>
                <div className='headboard-s'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate('/sudac/odabir-natjecanja')}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Ocjenjivanje nastupa</p>
                </div>

                <div className='kompetisn-list-container'>
                    {nastupi.length === 0 ? (
                        <p className='no-competitions-text'>Nema prijavljenih nastupa za ovo natjecanje.</p>
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
                </div>
            </div>
        </div>

    );
}

export default SocijeniNatjecanje