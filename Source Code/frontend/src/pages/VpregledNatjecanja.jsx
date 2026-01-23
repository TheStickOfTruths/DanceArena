import '../styles/v-pregled-natjecanja.css';
import '../styles/o-upravljanje-prijavama.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { getMojiNastupi } from '../services/apiService.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NastupMini = ({ nastup }) => {
    const [expanded, setExpanded] = useState(false);

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

function VpregledNatjecanja() {

    const { user: currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const [nastupi, setNastupi] = useState([]);

    useEffect(() => {
        const fetchNastupi = async () => {
            try {
                const data = await getMojiNastupi();
                setNastupi(data);
                console.log("Dohvaćeni nastupi:", data);
            }
            catch (error) {
                console.error("Greška pri dohvaćanju mojih nastupa:", error);
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

    return (
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='nastupi-content-container'>
                <div className='headboard-v'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate('/profile')}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Prijavljeni nastupi</p>
                </div>

                <div className='nastupi-list-container'>
                    {nastupi.length > 0 ? (
                        nastupi.map((nastup) => (
                            <NastupMini key={nastup.id} nastup={nastup} />
                        ))
                    ) : (
                        <p>Nema prijavljenih nastupa.</p>
                    )}
                </div>
            </div>
        </div>

    );
}

export default VpregledNatjecanja