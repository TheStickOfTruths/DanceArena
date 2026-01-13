import '../styles/o-placanje.css';
import Navbar from '../components/navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';
import axios from 'axios';

function Oplacanje() {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCurrentUser();

                if (response) {
                    setCurrentUser(response);
                }
            } catch (error) {
                console.error("Greška u Oplacanje.jsx:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handlePayPalPayment = async () => {
        try {
            setPaying(true);

            const response = await axios.post(
                // ne znam tocno path - ispred je stajalo https://localhost:8000
                "/users/create_subscription/",
                {},
                {
                    withCredentials: true, // ako koristite cookie auth
                }
            );

            const approveUrl = response.data?.approve_url;

            if (!approveUrl) {
                throw new Error("Approve URL nije dobiven");
            }

            window.open(approveUrl, "_blank");
        } catch (error) {
            console.error("PayPal greška:", error);
            alert("Došlo je do greške prilikom plaćanja.");
        } finally {
            setPaying(false);
        }
    };


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
        <div className="homepage-container">
            <Navbar
                currentUser={currentUser} />
            <div className="homepage-content-container">
                <p>Članarina je istekla!</p>
                <p>Iznos članarine za ovu godinu iznosi {}. Molimo vas odaberite način plaćanja:</p>
                <button
                    className="pay-button"
                    onClick={handlePayPalPayment}
                    disabled={paying}
                >
                    {paying ? "Preusmjeravanje na PayPal..." : "Plati PayPalom"}
                </button>
            </div>
        </div>
    )
};

export default Oplacanje;