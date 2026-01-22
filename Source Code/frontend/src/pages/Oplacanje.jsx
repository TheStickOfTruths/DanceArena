import '../styles/o-placanje.css';
import Navbar from '../components/navbar.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createSubscription, connectSubscription } from '../services/apiService.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Oplacanje() {

    const { user: currentUser, loading, checkSubscription } = useAuth();
    const [paying, setPaying] = useState(false);
    const navigate = useNavigate();


    const handlePayPalPayment = async (event) => {
        event.preventDefault();
        setPaying(true);

        try {
            const subscriptionData = await createSubscription();
            const popup = window.open(subscriptionData.links[0].href, "_blank", "width=600,height=800,left=200,top=100");

            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                }
            }, 500);
        } catch (error) {
            console.error("Error creating order:", error);
            setPaying(false);
            alert("Greška pri kreiranju narudžbe.");
        }
    };

    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'PAYPAL_SUCCESS') {
                const { subscriptionId } = event.data;

                try {
                    await connectSubscription({ subscription_id: subscriptionId });

                    await checkSubscription();

                    navigate('/homepage');

                } catch (err) {
                    console.error("Registration failed", err);
                    alert("Plaćanje je prošlo, ali povezivanje pretplate nije uspjelo. Kontaktirajte podršku.");
                } finally {
                    setPaying(false);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

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
                <p className="alert-text">Članarina je istekla!</p>
                <p>Kako bi ste nastavili koristiti usluge, molimo vas da izvršite uplatu članarine.</p>
                <button
                    className="pay-button"
                    onClick={handlePayPalPayment}
                    disabled={paying}
                >
                    {paying ? "Preusmjeravanje..." : "Plati PayPalom"}
                </button>
            </div>
        </div>
    )
};

export default Oplacanje;