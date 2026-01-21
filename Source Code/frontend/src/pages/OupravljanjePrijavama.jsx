import '../styles/o-upravljanje-prijavama.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import {
    getSudci,
    getNastupi,
    inviteSudac,
    acceptNastup,
    rejectNastup,
    denyNastup,
    closeCompetitionApplications
} from '../services/apiService.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const SudacMini = ({ sudac, onInvite }) => {
    return (
        <div className="sudac-mini">
            <div className="sudac-info">
                <p className="sudac-name">{sudac.name} {sudac.surname}</p>
                <p className="sudac-email">{sudac.email}</p>
            </div>
            <button
                className="pozovi-button"
                onClick={() => onInvite(sudac.email)}
            >
                Pozovi
            </button>
        </div>
    );
}

const nastupSetter = async (competitionId, nastupId, action) => {
    switch (action) {
        case 'accept':
            return await acceptNastup(competitionId, nastupId);
        case 'reject':
            return await rejectNastup(competitionId, nastupId);
        case 'deny':
            return await denyNastup(competitionId, nastupId);
        default:
            throw new Error('Nepoznata akcija za nastup');
    }
};

const updateNastupi = async (setNastupi, competitionID) => {
    try {
        const updatedNastupi = await getNastupi(competitionID);
        console.log("Osvježeni nastupi:", updatedNastupi);
        setNastupi(updatedNastupi);
    } catch (error) {
        console.error("Greška pri osvježavanju nastupa:", error);
    }
};


const NastupMini = ({ nastup, competitionID, setNastupi }) => {
    const [expanded, setExpanded] = useState(false);

    const handleAccept = async (e) => {
        e.stopPropagation();
        try {
            await nastupSetter(competitionID, nastup.id, nastup.accepted ? 'reject' : 'accept');
            updateNastupi(setNastupi, competitionID);
        } catch (error) {
            console.error("Greška pri prihvaćanju/opozivanju nastupa:", error);
        }
    };

    const handleReject = async (e) => {
        e.stopPropagation();
        try {
            await nastupSetter(competitionID, nastup.id, 'deny');
            updateNastupi(setNastupi, competitionID);
        } catch (error) {
            console.error("Greška pri odbijanju nastupa:", error);
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
                    {!nastup.accepted && <button className="odbij-btn" onClick={handleReject}>
                        Odbij
                    </button>}
                    <button
                        className={`prihvati-btn ${nastup.accepted ? 'opozovi-btn' : ''}`}
                        onClick={handleAccept}
                    >
                        {nastup.accepted ? "Opozovi" : "Prihvati"}
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

function OupravljanjePrijavama() {

    const { user: currentUser, loading } = useAuth();
    const navigate = useNavigate();

    const [pozvaniSudci, setPozvaniSudci] = useState([]);
    const [nepozvaniSudci, setNepozvaniSudci] = useState([]);

    const [nastupi, setNastupi] = useState([]);
    const location = useLocation();
    const competition = location.state?.competition || null;

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

    const updateSudci = async () => {
        const sviSudci = await getSudci(competition.id);
        const pozvani = sviSudci.filter(sudac => sudac.member);
        const nepozvani = sviSudci.filter(sudac => !sudac.member);
        setPozvaniSudci(pozvani);
        setNepozvaniSudci(nepozvani);
    };

    useEffect(() => {
        if (currentUser.role !== 'ORGANIZER' || !competition) {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            try {
                await updateSudci();
                const nastupiData = await getNastupi(competition.id);
                setNastupi(nastupiData);
            } catch (error) {
                console.error("Greška u OupravljanjePrijavama.jsx:", error);
            }
        };
        fetchData();
    }, [competition, currentUser, navigate]);



    const handleSudciInvite = async (e) => {
        e.preventDefault();
        const email = e.target.elements[0].value;
        const response = await sendInvite(email);
        if (response) {
            alert(`Pozivnica poslana na ${email}`);
            e.target.reset();
        }
    };

    const handleCloseApplications = async () => {
        try {
            await closeCompetitionApplications(competition.id);
            alert('Prijave su uspješno zatvorene.');
            navigate('/organizator/moja-natjecanja');
        } catch (error) {
            console.error("Greška pri zatvaranju prijava:", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('Došlo je do greške pri zatvaranju prijava.');
            }
        }
    };

    const sendInvite = async (email) => {
        try {
            const response = await inviteSudac(competition.id, email);
            await updateSudci();
            return response;
        } catch (error) {
            console.error("Greška pri slanju pozivnice:", error);
            alert('Došlo je do greške pri slanju pozivnice.');
        }
    };

    if (!competition || !currentUser) return null;

    return (
        <div className='stranica-container'>
            <Navbar currentUser={currentUser} />

            <div className='stranica-content-container'>
                <div className='headboard'>
                    <p>Pripremanje za {competition.name}</p>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Upravljanje prijavama</p>
                </div>
                <div className='sudci-nastupi-container'>

                    <div className='sudci-container'>
                        <p className="sudci-txt">Upravljanje sudcima:</p>
                        <div className="email-form">
                            <form onSubmit={handleSudciInvite}>
                                <input type="email" placeholder="Unesite email sudca" required />
                                <button type="submit">Pošalji pozivnicu</button>
                            </form>
                        </div>
                        <div className="sudci-lista">
                            {nepozvaniSudci.length > 0 ? <p>Dostupni sudci:</p> : <p>Pozvao si sve sudce što postoje, molim te nemoj više!</p>}
                            <div className="sudci-scroll">
                                {nepozvaniSudci.map((sudac) => (
                                    <SudacMini key={sudac.id} sudac={sudac} onInvite={sendInvite} />
                                ))}
                            </div>
                        </div>
                        <div className="sudci-lista">
                            {pozvaniSudci.length > 0 ? <p>Pozvani sudci:</p> : <p>Nisi pozvao nijednog suca još uvijek.</p>}
                            <div className="sudci-scroll">
                                {pozvaniSudci.map((sudac) => (
                                    <div key={sudac.id} className="sudac-mini">
                                        <p>{sudac.name} {sudac.surname} ({sudac.email})</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='nastupi-container'>
                        <p className="sudci-txt">Prijavljeni nastupi:</p>
                        <div className="nastupi-scroll">
                            {nastupi.length > 0 ? (
                                nastupi.map((nastup) => (
                                    <NastupMini key={nastup.id}
                                        nastup={nastup}
                                        competitionID={competition.id}
                                        setNastupi={setNastupi} />
                                ))
                            ) : (
                                <p>Nema prijavljenih nastupa.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="zatvaranje-botun" onClick={handleCloseApplications}>
                    ZATVORI PRIJAVE
                </div>
            </div>
        </div >

    );
}

export default OupravljanjePrijavama