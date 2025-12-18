import { useState } from 'react';
import '../styles/competitionmini.css';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('hr-HR', options);
};

const formatFee = (fee) => {
    const feeAmount = parseFloat(fee);
    return feeAmount === 0 ? 'Besplatno' : `${feeAmount.toFixed(2)} €`;
};

function CompetitionMini({ competition }) {
    const [isOpen, setIsOpen] = useState(false);

    const stilovi = competition.style_categories || [];
    const dobneSkupine = competition.age_categories || [];
    const velicineGrupa = competition.group_size_categories || [];

    return (
        <div className="competition-mini-container">
            <div className="competition-mini-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-main-info">
                    <h3>{competition.name}</h3>
                    <div className="header-meta">
                        <span><i className="bi bi-calendar-event"></i> {formatDate(competition.date)}</span>
                        <span><i className="bi bi-geo-alt-fill"></i> {competition.location}</span>
                    </div>
                </div>
                <div className="header-toggle">
                    <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </div>
            </div>

            {isOpen && (
                <div className="competition-mini-details">
                    <div className="details-grid">
                        <div className="detail-item">
                            <strong>Organizator:</strong>
                            <p>{competition.organizer}</p>
                        </div>
                        <div className="detail-item">
                            <strong>Kotizacija:</strong>
                            <p>{formatFee(competition.registration_fee)}</p>
                        </div>

                        <div className="detail-item category-group">
                            <strong><i className="bi bi-person-arms-up"></i> Dobne skupine:</strong>
                            <ul className="category-list">
                                {dobneSkupine.length > 0 ? (
                                    dobneSkupine.map(cat => <li key={cat}>{cat}</li>)
                                ) : (
                                    <li>Nije specificirano</li>
                                )}
                            </ul>
                        </div>

                        <div className="detail-item category-group">
                            <strong><i className="bi bi-music-note-beamed"></i> Stilovi:</strong>
                            <ul className="category-list">
                                {stilovi.length > 0 ? (
                                    stilovi.map(cat => <li key={cat}>{cat}</li>)
                                ) : (
                                    <li>Nije specificirano</li>
                                )}
                            </ul>
                        </div>

                        <div className="detail-item category-group">
                            <strong><i className="bi bi-people-fill"></i> Veličine grupa:</strong>
                            <ul className="category-list">
                                {velicineGrupa.length > 0 ? (
                                    velicineGrupa.map(cat => <li key={cat}>{cat}</li>)
                                ) : (
                                    <li>Nije specificirano</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompetitionMini;