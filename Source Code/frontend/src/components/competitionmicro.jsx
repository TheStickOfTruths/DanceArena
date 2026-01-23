import '../styles/competitionmicro.css';
import { publishCompetition, getStartnaLista, startCompetition, finishCompetition } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const CompetitionMicro = ({ competition, onUpdate }) => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/organizator/natjecanje/uredi/${competition.id}`);
    };

    const handlePublish = async (e) => {
        e.stopPropagation();
        try {
            await publishCompetition(competition.id);
            onUpdate({ ...competition, status: 'PUBLISHED' });
        } catch (error) {
            console.error("Greška pri objavi natjecanja:", error);
        }
    };

    const handlePrijavaNastupa = (e) => {
        e.stopPropagation();
        navigate('/voditelj/prijava-nastupa', { state: { competition } });
    };

    const handleManageRegistrations = (e) => {
        e.stopPropagation();
        navigate('/organizator/upravljanje-prijavama', { state: { competition } })
    };

    const handleViewStartList = async (e) => {
        e.stopPropagation();
        try {
            const startList = await getStartnaLista(competition.id);
            window.open(startList.link, '_blank');
        } catch (error) {
            console.error("Greška pri dohvaćanju startne liste:", error);
        }
    };

    const handleStartCompetition = async (e) => {
        e.stopPropagation();
        try {
            await startCompetition(competition.id);
            onUpdate({ ...competition, status: 'ACTIVE' });
        } catch (error) {
            console.error("Greška pri pokretanju natjecanja:", error);
        }
    };

    const handleFinishCompetition = async (e) => {
        e.stopPropagation();
        try {
            await finishCompetition(competition.id);
            onUpdate({ ...competition, status: 'COMPLETED' });
        } catch (error) {
            alert(error.response?.data?.error || 'Došlo je do greške pri završetku natjecanja.');
        }
    };

    const handleCompetitionDetails = (e) => {
        e.stopPropagation();
        navigate('/organizator/detalji-natjecanja', { state: { competition } });
    };

    const handleOcijeniNastupe = (e) => {
        e.stopPropagation();
        navigate('/sudac/odabir-nastupa', { state: { competition } });
    };

    const handleViewResults = (e) => {
        e.stopPropagation();
        navigate('/organizator/prikaz-rezultata', { state: { competition } });
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'DRAFT':
                return { label: 'U pripremi', className: 'status-draft' };
            case 'PUBLISHED':
                return { label: 'Objavljeno', className: 'status-published' };
            case 'CLOSED_APPLICATIONS':
                return { label: 'Prijave zatvorene', className: 'status-closed' };
            case 'ACTIVE':
                return { label: 'U tijeku', className: 'status-active' };
            case 'COMPLETED':
                return { label: 'Završeno', className: 'status-completed' };
            default:
                return { label: status, className: 'status-unknown' };
        }
    };

    const { label, className } = getStatusDetails(competition.status);

    const renderDetails = () => (
        <div className="comp-micro-details" onClick={(e) => e.stopPropagation()}>
            <div className="comp-micro-details-grid">
                <div className="detail-row"><span>Datum:</span> {competition.date}</div>
                <div className="detail-row"><span>Lokacija:</span> {competition.location}</div>
                <div className="detail-row"><span>Organizator:</span> {competition.organizer}</div>
                <div className="detail-row"><span>Kotizacija:</span> {competition.registration_fee} €</div>
            </div>
            <div className="detail-row"><span>Dobne kategorije:</span> {competition.age_categories?.join(', ')}</div>
            <div className="detail-row"><span>Plesni stilovi:</span> {competition.style_categories?.join(', ')}</div>
            <div className="detail-row"><span>Veličine grupa:</span> {competition.group_size_categories?.join(', ')}</div>
        </div>
    );

    if (user.role === "CLUB_MANAGER") {
        return (
            <div
                className={`comp-micro-container ${className}-border ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="comp-micro-header">
                    <div className="comp-micro-info">
                        <h3 className="comp-micro-name">{competition.name}</h3>
                        <span className={`status-badge ${className}`}>
                            {label}
                        </span>
                    </div>
                    <div className="comp-micro-actions">
                        <button className="micro-btn btn-primary" onClick={handlePrijavaNastupa}>
                            Prijavi Nastup
                        </button>
                    </div>
                </div>
                {expanded && renderDetails()}
            </div>
        );
    } if (user.role === "JUDGE") {
        return (
            <div
                className={`comp-micro-container ${className}-border ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="comp-micro-header">
                    <div className="comp-micro-info">
                        <h3 className="comp-micro-name">{competition.name}</h3>
                        <span className={`status-badge ${className}`}>
                            {label}
                        </span>
                    </div>
                    <div className="comp-micro-actions">
                        {competition.status === 'ACTIVE' && (
                            <button className="micro-btn btn-primary" onClick={handleOcijeniNastupe}>
                                Ocijeni Nastupe
                            </button>
                        )}
                    </div>
                </div>
                {expanded && renderDetails()}
            </div>
        );
    }
    else {
        return (
            <div
                className={`comp-micro-container ${className}-border ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="comp-micro-header">
                    <div className="comp-micro-info">
                        <h3 className="comp-micro-name">{competition.name}</h3>
                        <span className={`status-badge ${className}`}>
                            {label}
                        </span>
                    </div>

                    <div className="comp-micro-actions">
                        {competition.status === 'DRAFT' && (
                            <>
                                <button className="micro-btn btn-secondary-darker" onClick={handleEdit}>
                                    Uredi
                                </button>
                                <button className="micro-btn btn-primary" onClick={handlePublish}>
                                    Objavi
                                </button>
                            </>
                        )}

                        {competition.status === 'PUBLISHED' && (
                            <>
                                <button className="micro-btn btn-secondary" onClick={handleManageRegistrations}>
                                    Upravljaj Natjecanjem
                                </button>
                            </>
                        )}

                        {competition.status === 'CLOSED_APPLICATIONS' && (
                            <>
                                <button className="micro-btn btn-secondary" onClick={handleViewStartList}>
                                    Pregledaj startnu listu
                                </button>
                                <button className="micro-btn btn-primary-darker" onClick={handleStartCompetition}>
                                    Započni Natjecanje
                                </button>
                            </>
                        )}

                        {competition.status === 'ACTIVE' && (
                            <>
                                <button className="micro-btn btn-secondary" onClick={handleCompetitionDetails}>
                                    Detalji natjecanja
                                </button>
                                <button className="micro-btn btn-primary" onClick={handleFinishCompetition}>
                                    Završi natjecanje
                                </button>
                            </>
                        )}

                        {competition.status === 'COMPLETED' && (
                            <button className="micro-btn btn-secondary-darker" onClick={handleViewResults}>
                                Rezultati
                            </button>
                        )}
                    </div>
                </div>
                {expanded && renderDetails()}
            </div>
        );
    }
};

export default CompetitionMicro;