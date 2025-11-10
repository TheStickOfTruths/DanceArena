import '../styles/homepage.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import { getCurrentUser } from '../services/apiService.jsx';

function Homepage() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCurrentUser();

                if (response) {
                    setCurrentUser(response);
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
                        <img src="/gifs/the greatest dancer of all.gif" alt="Description of your GIF" />
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