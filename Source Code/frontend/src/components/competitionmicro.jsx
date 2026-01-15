import React from 'react';
import '../styles/competitionmicro.css';
import { publishCompetition } from '../services/apiService';

const CompetitionMicro = ({ competition, onUpdate }) => {

    const handleEdit = (e) => {
        e.stopPropagation();
        console.log("Uredi natjecanje:", competition.name);
    };

    const handlePublish = async (e) => {
        e.stopPropagation();
        try {
            await publishCompetition(competition.id);
            console.log("Objavi natjecanje:", competition.name);
            onUpdate({ ...competition, status: 'PUBLISHED' });
        } catch (error) {
            console.error("Greška pri objavi natjecanja:", error);
        }
    };

    const handleInviteJudges = (e) => {
        e.stopPropagation();
        console.log("Pozovi sudce za:", competition.name);
    };

    const handleManageRegistrations = (e) => {
        e.stopPropagation();
        console.log("Upravljaj prijavama za:", competition.name);
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

    return (
        <div className={`comp-micro-container ${className}-border`}>
            <div className="comp-micro-info">
                <h3 className="comp-micro-name">{competition.name}</h3>
                <span className={`status-badge ${className}`}>
                    {label}
                </span>
            </div>

            <div className="comp-micro-actions">

                {/* 1. STATUS: DRAFT */}
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

                {/* 2. STATUS: PUBLISHED */}
                {competition.status === 'PUBLISHED' && (
                    <>
                        <button className="micro-btn btn-purple" onClick={handleInviteJudges}>
                            Pozovi Sudce
                        </button>
                        <button className="micro-btn btn-secondary" onClick={handleManageRegistrations}>
                            Upravljaj Prijavama
                        </button>
                    </>
                )}

                {/* --- PLACEHOLDERS ZA BUDUĆNOST --- */}

                {competition.status === 'CLOSED_APPLICATIONS' && (
                    <button className="micro-btn btn-primary-darker" onClick={(e) => e.stopPropagation()}>
                        Pregledaj startne liste
                    </button>
                )}

                {competition.status === 'ACTIVE' && (
                    <button className="micro-btn btn-primary" onClick={(e) => e.stopPropagation()}>
                        Unesi rezultate
                    </button>
                )}

                {competition.status === 'COMPLETED' && (
                    <button className="micro-btn btn-secondary-darker" onClick={(e) => e.stopPropagation()}>
                        Rezultati
                    </button>
                )}

            </div>
        </div>
    );
};

export default CompetitionMicro;