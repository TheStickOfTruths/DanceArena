import '../styles/homepage.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import CompetitionMini from '../components/competitionmini.jsx';
import { getCurrentUser, getLiveCompetitions } from '../services/apiService.jsx';

function Homepage() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCurrentUser();

                if (response) {
                    setCurrentUser(response);
                    const competitionsResponse = await getLiveCompetitions();
                    setCompetitions(competitionsResponse);
                }
            } catch (error) {
                console.error("Greška u homepage.jsx:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="homepage-container">
                <Navbar />
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-container">
            <Navbar currentUser={currentUser} />
            <div className="homepage-content-container">
                {currentUser ? (
                    <>
                        <p>Uspješno ulogirani!</p>
                        <p>Dobrodošao {currentUser.first_name} ({currentUser.email})!</p>
                        <div className="competitions-container">
                            {competitions.length > 0 ? (
                                competitions.map((competition) => (
                                    <CompetitionMini key={competition.id} competition={competition} />
                                ))
                            ) : (
                                <p>Nema natjecanja</p>)}
                        </div>
                    </>
                ) : (
                    <>
                        <p>Niste prijavljeni.</p>
                        <Link to="/login">Idi na prijavu</Link>
                    </>
                )}
            </div>
        </div>
    )
};

export default Homepage;